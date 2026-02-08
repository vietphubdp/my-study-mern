import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    tags: [{ type: String }],
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    leitnerBox: { type: Number, min: 1, max: 5, default: 1 },
    nextReviewAt: { type: Date, default: Date.now },
    lastReviewedAt: Date,
  },
  { timestamps: true }
);

export const Flashcard = mongoose.model('Flashcard', flashcardSchema);
