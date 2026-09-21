import prisma from '../config/db.js';

export const getPublicStoreSettings = async (req, res, next) => {
  try {
    let settings = await prisma.storeSetting.findFirst();

    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: {
          storeName: "CHI J'S Collection",
          tagline: 'Fashion that speaks for you',
          announcement: 'Delivery available nationwide • Visit our store in Warri',
          announcementEnabled: true,
          phone: '+2348000000000',
          whatsappNumber: '2348000000000',
          whatsappTemplate: `Hello CHI J'S Collection 👋\n\nI'd like to order:\n\nProduct: {{product_name}}\nSize: {{size}}\nPrice: {{price}}\n\nProduct Link:\n{{product_url}}\n\nPlease confirm availability.\n\nThank you!`,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminStoreSettings = async (req, res, next) => {
  try {
    let settings = await prisma.storeSetting.findFirst();

    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: {
          storeName: "CHI J'S Collection",
          tagline: 'Fashion that speaks for you',
          announcement: 'Delivery available nationwide • Visit our store in Warri',
          announcementEnabled: true,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStoreSettings = async (req, res, next) => {
  try {
    const {
      storeName,
      tagline,
      logo,
      phone,
      whatsappNumber,
      whatsappTemplate,
      email,
      address,
      city,
      state,
      mapsUrl,
      openingHours,
      deliveryInfo,
      exchangePolicy,
      announcement,
      announcementEnabled,
      instagram,
      facebook,
      tiktok,
    } = req.body;

    let settings = await prisma.storeSetting.findFirst();

    const updateData = {};
    if (storeName !== undefined) updateData.storeName = storeName.trim();
    if (tagline !== undefined) updateData.tagline = tagline ? tagline.trim() : null;
    if (logo !== undefined) updateData.logo = logo || null;
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber ? whatsappNumber.replace(/[^0-9]/g, '') : null;
    if (whatsappTemplate !== undefined) updateData.whatsappTemplate = whatsappTemplate || null;
    if (email !== undefined) updateData.email = email ? email.trim().toLowerCase() : null;
    if (address !== undefined) updateData.address = address ? address.trim() : null;
    if (city !== undefined) updateData.city = city ? city.trim() : null;
    if (state !== undefined) updateData.state = state ? state.trim() : null;
    if (mapsUrl !== undefined) updateData.mapsUrl = mapsUrl ? mapsUrl.trim() : null;
    if (openingHours !== undefined) updateData.openingHours = openingHours;
    if (deliveryInfo !== undefined) updateData.deliveryInfo = deliveryInfo || null;
    if (exchangePolicy !== undefined) updateData.exchangePolicy = exchangePolicy || null;
    if (announcement !== undefined) updateData.announcement = announcement ? announcement.trim() : null;
    if (announcementEnabled !== undefined) updateData.announcementEnabled = Boolean(announcementEnabled);
    if (instagram !== undefined) updateData.instagram = instagram ? instagram.trim() : null;
    if (facebook !== undefined) updateData.facebook = facebook ? facebook.trim() : null;
    if (tiktok !== undefined) updateData.tiktok = tiktok ? tiktok.trim() : null;

    if (settings) {
      settings = await prisma.storeSetting.update({
        where: { id: settings.id },
        data: updateData,
      });
    } else {
      settings = await prisma.storeSetting.create({
        data: updateData,
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
      message: 'Store settings updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
