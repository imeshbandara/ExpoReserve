import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

const SESSION_COOKIE_NAME = 'session_token';

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies[SESSION_COOKIE_NAME];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'fallback_session_secret');
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        oidc_sub: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authenticate = requireAuth;

export const requireRole = (roleOrRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }

    next();
  };
};
