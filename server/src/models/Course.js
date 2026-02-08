import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    visibility: { type: String, enum: ['private', 'unlisted', 'public'], default: 'private' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Course = mongoose.model('Course', courseSchema);
