import prisma from '../config/db.js';
import { createSlug } from '../utils/slugify.js';

export const getPublicProducts = async (req, res, next) => {
  try {
    const { category, search, featured, stock, limit = 24, page = 1 } = req.query;

    const where = {
      isPublished: true,
    };

    if (category) {
      where.category = {
        OR: [
          { slug: category },
          { id: category },
        ],
      };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    if (featured === 'true' || featured === true) {
      where.isFeatured = true;
    }

    if (stock) {
      where.stockStatus = stock;
    }

    const take = Math.min(Math.max(parseInt(limit, 10) || 24, 1), 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * take;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
    ]);

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      categoryId: p.categoryId,
      category: p.category,
      sizes: p.sizes,
      stockStatus: p.stockStatus,
      isFeatured: p.isFeatured,
      images: p.images.map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.altText,
        sortOrder: img.sortOrder,
      })),
      createdAt: p.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: formatted,
      meta: {
        total,
        page: parseInt(page, 10) || 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product || !product.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or currently unavailable.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        categoryId: product.categoryId,
        category: product.category,
        sizes: product.sizes,
        stockStatus: product.stockStatus,
        isFeatured: product.isFeatured,
        isPublished: product.isPublished,
        images: product.images.map((img) => ({
          id: img.id,
          url: img.url,
          altText: img.altText,
          sortOrder: img.sortOrder,
        })),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const { search, category, stock, published } = req.query;

    const where = {};

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (stock) {
      where.stockStatus = stock;
    }

    if (published !== undefined) {
      where.isPublished = published === 'true';
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      categoryId: p.categoryId,
      category: p.category,
      sizes: p.sizes,
      stockStatus: p.stockStatus,
      isFeatured: p.isFeatured,
      isPublished: p.isPublished,
      images: p.images,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...product,
        price: Number(product.price),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      sizes = [],
      stockStatus = 'IN_STOCK',
      isFeatured = false,
      isPublished = true,
      images = [],
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required.',
      });
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid product price is required.',
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'A valid category is required.',
      });
    }

    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'The selected category does not exist.',
      });
    }

    let slug = createSlug(name);
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || '',
        price: Number(price),
        categoryId,
        sizes: Array.isArray(sizes) ? sizes : [],
        stockStatus: stockStatus === 'SOLD_OUT' ? 'SOLD_OUT' : 'IN_STOCK',
        isFeatured: Boolean(isFeatured),
        isPublished: Boolean(isPublished),
        images: {
          create: (images || []).map((img, idx) => ({
            url: typeof img === 'string' ? img : img.url,
            altText: typeof img === 'object' ? img.altText : null,
            sortOrder: typeof img === 'object' && img.sortOrder !== undefined ? img.sortOrder : idx,
          })),
        },
      },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        ...product,
        price: Number(product.price),
      },
      message: 'Product created successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      categoryId,
      sizes,
      stockStatus,
      isFeatured,
      isPublished,
      images,
    } = req.body;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const updateData = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
      // Keep slug stable once published (specification rule #29)
      if (!existing.isPublished && existing.name !== name.trim()) {
        let newSlug = createSlug(name);
        const existingSlug = await prisma.product.findFirst({
          where: { slug: newSlug, NOT: { id } },
        });
        if (existingSlug) {
          newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
        }
        updateData.slug = newSlug;
      }
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (price !== undefined) {
      if (isNaN(Number(price)) || Number(price) < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a positive number.',
        });
      }
      updateData.price = Number(price);
    }

    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Selected category does not exist.',
        });
      }
      updateData.categoryId = categoryId;
    }

    if (sizes !== undefined) {
      updateData.sizes = Array.isArray(sizes) ? sizes : [];
    }

    if (stockStatus !== undefined) {
      updateData.stockStatus = stockStatus === 'SOLD_OUT' ? 'SOLD_OUT' : 'IN_STOCK';
    }

    if (isFeatured !== undefined) {
      updateData.isFeatured = Boolean(isFeatured);
    }

    if (isPublished !== undefined) {
      updateData.isPublished = Boolean(isPublished);
    }

    // Handle images update if provided
    if (images !== undefined && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((img, idx) => ({
            productId: id,
            url: typeof img === 'string' ? img : img.url,
            altText: typeof img === 'object' ? img.altText : null,
            sortOrder: typeof img === 'object' && img.sortOrder !== undefined ? img.sortOrder : idx,
          })),
        });
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        ...updated,
        price: Number(updated.price),
      },
      message: 'Product updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Cascade deletes product images via Prisma relation onDelete: Cascade
    await prisma.product.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: `Product "${existing.name}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stockStatus } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const newStatus = stockStatus || (existing.stockStatus === 'IN_STOCK' ? 'SOLD_OUT' : 'IN_STOCK');

    const updated = await prisma.product.update({
      where: { id },
      data: { stockStatus: newStatus },
      select: { id: true, name: true, stockStatus: true },
    });

    return res.status(200).json({
      success: true,
      data: updated,
      message: `Stock status updated to ${newStatus === 'IN_STOCK' ? 'In Stock' : 'Sold Out'}.`,
    });
  } catch (error) {
    next(error);
  }
};

export const togglePublish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const newPublish = isPublished !== undefined ? Boolean(isPublished) : !existing.isPublished;

    const updated = await prisma.product.update({
      where: { id },
      data: { isPublished: newPublish },
      select: { id: true, name: true, isPublished: true },
    });

    return res.status(200).json({
      success: true,
      data: updated,
      message: `Product is now ${newPublish ? 'published' : 'draft/unpublished'}.`,
    });
  } catch (error) {
    next(error);
  }
};
