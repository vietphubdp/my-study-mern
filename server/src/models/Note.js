import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    markdownContent: { type: String, default: '' },
    tags: [{ type: String }],
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export const Note = mongoose.model('Note', noteSchema);
