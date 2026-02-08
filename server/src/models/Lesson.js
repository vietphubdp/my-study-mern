import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    markdownContent: { type: String, default: '' },
    attachments: [{ type: String }],
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Lesson = mongoose.model('Lesson', lessonSchema);
