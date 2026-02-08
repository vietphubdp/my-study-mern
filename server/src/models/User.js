import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'user'], default: 'user' },
    emailVerified: { type: Boolean, default: false },
    profile: {
      displayName: { type: String, default: '' },
      avatarUrl: { type: String, default: '' },
      bio: { type: String, default: '' },
    },
    privacy: {
      profileVisibility: { type: String, enum: ['private', 'public'], default: 'private' },
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
