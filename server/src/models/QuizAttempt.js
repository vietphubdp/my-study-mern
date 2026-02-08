import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizConfig: { type: Object, default: {} },
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuizQuestion' }],
    startedAt: { type: Date, default: Date.now },
    submittedAt: Date,
    score: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizQuestion' },
        userAnswer: String,
        isCorrect: Boolean,
        timeSpentSec: Number,
      },
    ],
  },
  { timestamps: true }
);

export const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
