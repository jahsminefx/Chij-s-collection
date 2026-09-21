import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for CHI J\'S Collection...');

  // 1. Seed Admin User
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@chijscollection.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
  const adminName = process.env.ADMIN_NAME || 'CHI J\'S Owner';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: 'OWNER',
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Store Settings
  let settings = await prisma.storeSetting.findFirst();
  const defaultOpeningHours = [
    { day: 'Monday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'Tuesday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'Wednesday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'Thursday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'Friday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'Saturday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'Sunday', openTime: '12:00', closeTime: '17:00', isOpen: false },
  ];

  const defaultTemplate = `Hello CHI J'S Collection 👋\n\nI'd like to order:\n\nProduct: {{product_name}}\nSize: {{size}}\nPrice: {{price}}\n\nProduct Link:\n{{product_url}}\n\nPlease confirm availability.\n\nThank you!`;

  const settingsData = {
    storeName: "CHI J'S Collection",
    tagline: 'Refined Contemporary Fashion & Curated Footwear',
    logo: '/logo.jpg',
    phone: '+234 812 345 6789',
    whatsappNumber: '2348123456789',
    whatsappTemplate: defaultTemplate,
    email: 'contact@chijscollection.com',
    address: 'Plot 14 Airport Road, Opposite High Court',
    city: 'Warri',
    state: 'Delta State',
    mapsUrl: 'https://maps.google.com/?q=Warri+Delta+State',
    openingHours: defaultOpeningHours,
    deliveryInfo: 'We deliver nationwide across Nigeria via trusted courier partners. Deliveries within Warri are dispatched same-day or next-day. Deliveries to Lagos, Abuja, Port Harcourt, and other states take 2–4 business days.',
    exchangePolicy: 'Items can be exchanged for a different size within 3 days of receipt, provided the item is unworn, unwashed, and retains all original tags. Due to hygiene considerations, intimate items and customized pieces cannot be exchanged.',
    announcement: '✨ New Arrivals Just Dropped! Nationwide delivery available on all orders.',
    announcementEnabled: true,
    instagram: 'https://instagram.com/chijscollection',
    facebook: 'https://facebook.com/chijscollection',
    tiktok: 'https://tiktok.com/@chijscollection',
  };

  if (settings) {
    settings = await prisma.storeSetting.update({
      where: { id: settings.id },
      data: settingsData,
    });
  } else {
    settings = await prisma.storeSetting.create({
      data: settingsData,
    });
  }

  console.log(`✅ Store settings seeded.`);

  // 3. Seed Categories
  const categoryData = [
    {
      name: 'Shirts',
      slug: 'shirts',
      description: 'Crisp casual, linen, and formal statement shirts tailored for refined comfort.',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Trousers',
      slug: 'trousers',
      description: 'Smart pleated trousers, tailored chinos, and relaxed aesthetic bottoms.',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Shoes',
      slug: 'shoes',
      description: 'Handcrafted leather loafers, dress shoes, and premium urban footwear.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Palms & Slides',
      slug: 'palms-and-slides',
      description: 'Handmade leather palms, luxury slides, and effortless open-toe comfort.',
      image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Finishing touches: genuine leather belts, sunglasses, caps, and jewelry.',
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const categories = {};
  for (const cat of categoryData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        isActive: true,
      },
    });
  }

  console.log(`✅ Categories seeded: ${Object.keys(categories).join(', ')}`);

  // 4. Seed Products
  const sampleProducts = [
    {
      name: 'Classic Noir Linen Button-Down Shirt',
      slug: 'classic-noir-linen-button-down-shirt',
      description: 'A breezy, textured black linen shirt crafted from 100% natural fibers. Designed with a clean mandarin collar, mother-of-pearl buttons, and a relaxed tailored drape suitable for both sunny afternoons and evening socials.',
      price: 26500,
      categoryId: categories['shirts'].id,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80', altText: 'Classic Noir Linen Shirt Front View', sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80', altText: 'Linen Shirt Collar and Texture Detail', sortOrder: 1 },
      ],
    },
    {
      name: 'Earthy Olive Resort Short-Sleeve Shirt',
      slug: 'earthy-olive-resort-short-sleeve-shirt',
      description: 'Effortless warm-weather styling. Features a camp collar, breathable cotton-viscose blend fabric, and a modern relaxed silhouette.',
      price: 22000,
      categoryId: categories['shirts'].id,
      sizes: ['M', 'L', 'XL'],
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80', altText: 'Olive Resort Shirt Front', sortOrder: 0 },
      ],
    },
    {
      name: 'Tailored Cream Wide-Leg Pleated Trousers',
      slug: 'tailored-cream-wide-leg-pleated-trousers',
      description: 'Impeccably tailored pleated trousers with side adjusters, double front pleats, and an elegant fluid drape. Perfect paired with linen shirts or lightweight knits.',
      price: 34000,
      categoryId: categories['trousers'].id,
      sizes: ['30', '32', '34', '36', '38'],
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80', altText: 'Cream Pleated Trousers Full Length', sortOrder: 0 },
      ],
    },
    {
      name: 'Charcoal Minimalist Chino Pants',
      slug: 'charcoal-minimalist-chino-pants',
      description: 'Versatile stretch-cotton chinos in deep charcoal. Flat front, tailored slim-straight leg, ideal for both casual and semi-formal wear.',
      price: 28500,
      categoryId: categories['trousers'].id,
      sizes: ['32', '34', '36'],
      stockStatus: 'SOLD_OUT',
      isFeatured: false,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80', altText: 'Charcoal Chino Pants', sortOrder: 0 },
      ],
    },
    {
      name: 'Handcrafted Penny Leather Loafers',
      slug: 'handcrafted-penny-leather-loafers',
      description: 'Rich cognac brown full-grain leather loafers featuring a cushioned leather insole, hand-stitched welt, and durable leather outsole. Handcrafted for lasting refinement.',
      price: 48000,
      categoryId: categories['shoes'].id,
      sizes: ['40', '41', '42', '43', '44', '45'],
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80', altText: 'Penny Loafers Angle View', sortOrder: 0 },
      ],
    },
    {
      name: 'Cross-Strap Leather Comfort Palms',
      slug: 'cross-strap-leather-comfort-palms',
      description: 'Artisanal Nigerian leather slide with supportive contoured footbed and genuine cowhide upper strap. Lightweight, ultra-comfortable, and built for daily wear.',
      price: 24000,
      categoryId: categories['palms-and-slides'].id,
      sizes: ['40', '41', '42', '43', '44'],
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1000&q=80', altText: 'Cross-Strap Leather Palms', sortOrder: 0 },
      ],
    },
    {
      name: 'Double-Buckle Suede Ergonomic Slides',
      slug: 'double-buckle-suede-ergonomic-slides',
      description: 'Warm taupe suede slides with adjustable brushed bronze buckles and cork-latex footbed.',
      price: 21500,
      categoryId: categories['palms-and-slides'].id,
      sizes: ['41', '42', '43', '44'],
      stockStatus: 'IN_STOCK',
      isFeatured: false,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80', altText: 'Double Buckle Slides', sortOrder: 0 },
      ],
    },
    {
      name: 'Vintage Amber Acetate Sunglasses',
      slug: 'vintage-amber-acetate-sunglasses',
      description: 'Square silhouette sunglasses in rich tortoise amber acetate with UV400 polarized green-tinted lenses.',
      price: 16000,
      categoryId: categories['accessories'].id,
      sizes: ['One Size'],
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80', altText: 'Vintage Amber Sunglasses', sortOrder: 0 },
      ],
    },
  ];

  for (const prod of sampleProducts) {
    const { images, ...prodData } = prod;

    const createdProd = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        ...prodData,
      },
      create: {
        ...prodData,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: createdProd.id } });
    if (images && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((img, idx) => ({
          productId: createdProd.id,
          url: img.url,
          altText: img.altText || createdProd.name,
          sortOrder: img.sortOrder !== undefined ? img.sortOrder : idx,
        })),
      });
    }
  }

  console.log(`✅ Sample products seeded successfully.`);
  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
