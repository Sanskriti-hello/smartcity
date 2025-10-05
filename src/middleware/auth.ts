import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export interface JWTPayload {
  sub: string;
  role: string;
  email: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = decoded as JWTPayload;

    if (!req.user.sub) {
      return res.status(403).json({ error: 'Invalid token: Missing user identifier.' });
    }

    next();
  });

  // Ensure a return statement for all code paths
  return;
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.sub) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    return next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requireServiceProvider = requireRole(['service_provider']);
export const requireCitizen = requireRole(['citizen']);
export const requireAdminOrServiceProvider = requireRole(['admin', 'service_provider']);
