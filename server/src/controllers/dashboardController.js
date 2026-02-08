import { Flashcard } from '../models/Flashcard.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { StudySession } from '../models/StudySession.js';

export const summary = async (req, res) => {
  const userId = req.user.sub;
  const now = new Date();
  const dueCards = await Flashcard.countDocuments({ ownerId: userId, nextReviewAt: { $lte: now } });
  const attempts = await QuizAttempt.find({ userId, submittedAt: { $ne: null } });

  const avgAccuracy = attempts.length
    ? Math.round(attempts.reduce((sum, a) => sum + (a.accuracy || 0), 0) / attempts.length)
    : 0;

  const sessions = await StudySession.find({ userId, endedAt: { $ne: null } });
  const totalStudySec = sessions.reduce((sum, s) => sum + (s.durationSec || 0), 0);

  const streak = 0;
  res.json({ streak, dueCards, avgAccuracy, totalStudySec });
};
