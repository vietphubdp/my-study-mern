import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: Date,
    durationSec: { type: Number, default: 0 },
    activityType: { type: String, enum: ['flashcard', 'quiz', 'reading'], required: true },
  },
  { timestamps: true }
);

export const StudySession = mongoose.model('StudySession', studySessionSchema);
