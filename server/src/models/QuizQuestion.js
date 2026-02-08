import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['mcq', 'true_false', 'fill_blank'], required: true },
    prompt: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, default: '' },
    tags: [{ type: String }],
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  },
  { timestamps: true }
);

export const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);
