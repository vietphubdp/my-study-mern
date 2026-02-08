import { AppError } from '../utils/appError.js';
import { verifyAccessToken } from '../utils/tokens.js';

export const requireAuth = (req, _res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) return next(new AppError(401, 'Unauthorized'));

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return next(new AppError(401, 'Invalid token'));
  }
};

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError(403, 'Forbidden'));
  }
  return next();
};
