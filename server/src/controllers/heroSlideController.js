import prisma from '../config/db.js';

const MAX_HERO_SLOTS = 6;

/**
 * Public: Get active hero slides for storefront slideshow
 */
export const getPublicHeroSlides = async (req, res, next) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: MAX_HERO_SLOTS,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stockStatus: true,
            images: {
              take: 1,
              orderBy: { sortOrder: 'asc' },
              select: { url: true, altText: true },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: slides,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all hero slides (active & inactive)
 */
export const getAdminHeroSlides = async (req, res, next) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stockStatus: true,
            images: {
              take: 1,
              orderBy: { sortOrder: 'asc' },
              select: { url: true, altText: true },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: slides,
      totalSlots: MAX_HERO_SLOTS,
      usedSlots: slides.length,
      availableSlots: Math.max(0, MAX_HERO_SLOTS - slides.length),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create a new hero slide (enforces maximum 6 slots)
 */
export const createHeroSlide = async (req, res, next) => {
  try {
    const currentCount = await prisma.heroSlide.count();
    if (currentCount >= MAX_HERO_SLOTS) {
      return res.status(400).json({
        success: false,
        message: `Maximum limit reached: The hero slideshow can have at most ${MAX_HERO_SLOTS} slots. Delete or edit an existing slot.`,
      });
    }

    const { title, subtitle, imageUrl, productId, isActive, sortOrder } = req.body;

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required for a hero slide.',
      });
    }

    // Verify productId if provided
    let verifiedProductId = null;
    if (productId && productId.trim() !== '') {
      const product = await prisma.product.findUnique({
        where: { id: productId.trim() },
      });
      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'The selected product does not exist.',
        });
      }
      verifiedProductId = product.id;
    }

    const assignedOrder = typeof sortOrder === 'number' ? sortOrder : currentCount;

    const slide = await prisma.heroSlide.create({
      data: {
        title: title ? title.trim() : null,
        subtitle: subtitle ? subtitle.trim() : null,
        imageUrl: imageUrl.trim(),
        productId: verifiedProductId,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        sortOrder: assignedOrder,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stockStatus: true,
            images: {
              take: 1,
              orderBy: { sortOrder: 'asc' },
              select: { url: true, altText: true },
            },
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: slide,
      message: 'Hero slide created successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update a hero slide
 */
export const updateHeroSlide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, subtitle, imageUrl, productId, isActive, sortOrder } = req.body;

    const existing = await prisma.heroSlide.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found.',
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title ? title.trim() : null;
    if (subtitle !== undefined) updateData.subtitle = subtitle ? subtitle.trim() : null;
    if (imageUrl !== undefined) {
      if (!imageUrl || imageUrl.trim() === '') {
        return res.status(400).json({ success: false, message: 'Image URL cannot be empty.' });
      }
      updateData.imageUrl = imageUrl.trim();
    }
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);

    if (productId !== undefined) {
      if (productId && productId.trim() !== '') {
        const product = await prisma.product.findUnique({ where: { id: productId.trim() } });
        if (!product) {
          return res.status(400).json({ success: false, message: 'The selected product does not exist.' });
        }
        updateData.productId = product.id;
      } else {
        updateData.productId = null;
      }
    }

    const updated = await prisma.heroSlide.update({
      where: { id },
      data: updateData,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stockStatus: true,
            images: {
              take: 1,
              orderBy: { sortOrder: 'asc' },
              select: { url: true, altText: true },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: updated,
      message: 'Hero slide updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete a hero slide
 */
export const deleteHeroSlide = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.heroSlide.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found.',
      });
    }

    await prisma.heroSlide.delete({ where: { id } });

    // Re-index remaining slides to keep sortOrder clean 0, 1, 2...
    const remaining = await prisma.heroSlide.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].sortOrder !== i) {
        await prisma.heroSlide.update({
          where: { id: remaining[i].id },
          data: { sortOrder: i },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Hero slide deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Reorder hero slides
 */
export const reorderHeroSlides = async (req, res, next) => {
  try {
    const { slides } = req.body;
    if (!Array.isArray(slides)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload. "slides" array expected: [{ id, sortOrder }].',
      });
    }

    // Update in transaction
    await prisma.$transaction(
      slides.map((item) =>
        prisma.heroSlide.update({
          where: { id: item.id },
          data: { sortOrder: Number(item.sortOrder) },
        })
      )
    );

    const updatedSlides = await prisma.heroSlide.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stockStatus: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedSlides,
      message: 'Hero slide order updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
