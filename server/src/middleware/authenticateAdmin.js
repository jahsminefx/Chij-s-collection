import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.admin_token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in as an administrator.',
      });
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    let decoded;

    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.',
      });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'User account not found or access revoked.',
      });
    }

    req.user = admin;
    next();
  } catch (error) {
    next(error);
  }
};
