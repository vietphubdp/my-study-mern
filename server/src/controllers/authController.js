import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { AppError } from '../utils/appError.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';

const refreshCookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  path: '/api/auth',
};

const buildTokens = async (user, req) => {
  const payload = { sub: user._id.toString(), role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14) * 86400000),
    userAgent: req.headers['user-agent'] || '',
    ip: req.ip,
  });

  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  const { email, password, displayName } = req.body;
  if (!email || !password) return next(new AppError(400, 'email and password are required'));

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return next(new AppError(409, 'Email already exists'));

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, profile: { displayName: displayName || '' } });

  const tokens = await buildTokens(user, req);
  res.cookie('refreshToken', tokens.refreshToken, refreshCookieOpts);

  res.status(201).json({
    user: { id: user._id, email: user.email, role: user.role, profile: user.profile },
    accessToken: tokens.accessToken,
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) return next(new AppError(401, 'Invalid credentials'));

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return next(new AppError(401, 'Invalid credentials'));

  const tokens = await buildTokens(user, req);
  res.cookie('refreshToken', tokens.refreshToken, refreshCookieOpts);

  res.json({
    user: { id: user._id, email: user.email, role: user.role, profile: user.profile },
    accessToken: tokens.accessToken,
  });
};

export const refresh = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new AppError(401, 'Missing refresh token'));

  const stored = await RefreshToken.findOne({ token, revokedAt: null });
  if (!stored) return next(new AppError(401, 'Invalid refresh token'));

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    return next(new AppError(401, 'Expired/invalid refresh token'));
  }

  stored.revokedAt = new Date();
  await stored.save();

  const user = await User.findById(payload.sub);
  if (!user) return next(new AppError(401, 'User not found'));

  const tokens = await buildTokens(user, req);
  res.cookie('refreshToken', tokens.refreshToken, refreshCookieOpts);
  return res.json({ accessToken: tokens.accessToken });
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    await RefreshToken.updateMany({ token, revokedAt: null }, { revokedAt: new Date() });
  }
  res.clearCookie('refreshToken', refreshCookieOpts);
  res.json({ message: 'Logged out' });
};

export const me = async (req, res, next) => {
  const user = await User.findById(req.user.sub).select('-passwordHash');
  if (!user) return next(new AppError(404, 'User not found'));
  res.json(user);
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) return res.json({ message: 'If account exists, reset link generated' });

  const token = nanoid(32);
  user.resetPasswordToken = token;
  user.resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 15);
  await user.save();

  return res.json({ message: 'Reset token generated', resetToken: token });
};

export const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ resetPasswordToken: token });
  if (!user || !user.resetPasswordExpiresAt || user.resetPasswordExpiresAt < new Date()) {
    return next(new AppError(400, 'Invalid/expired reset token'));
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
};
