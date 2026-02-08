import { QuizQuestion } from '../models/QuizQuestion.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { AppError } from '../utils/appError.js';

export const createQuestion = async (req, res) => {
  const question = await QuizQuestion.create({ ...req.body, ownerId: req.user.sub });
  res.status(201).json(question);
};

export const listQuestions = async (req, res) => {
  const filter = { ownerId: req.user.sub };
  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.topicId) filter.topicId = req.query.topicId;
  res.json(await QuizQuestion.find(filter).sort({ createdAt: -1 }));
};

export const startQuiz = async (req, res) => {
  const { tag, topicId, count = 10, timeLimitSec = 600 } = req.body;
  const filter = { ownerId: req.user.sub };
  if (tag) filter.tags = tag;
  if (topicId) filter.topicId = topicId;

  const questions = await QuizQuestion.aggregate([{ $match: filter }, { $sample: { size: Number(count) } }]);

  const attempt = await QuizAttempt.create({
    userId: req.user.sub,
    quizConfig: { tag, topicId, count, timeLimitSec },
    questionIds: questions.map((q) => q._id),
  });

  res.status(201).json({
    attemptId: attempt._id,
    timeLimitSec,
    questions: questions.map((q) => ({
      id: q._id,
      type: q.type,
      prompt: q.prompt,
      options: q.options,
    })),
  });
};

export const submitQuiz = async (req, res, next) => {
  const attempt = await QuizAttempt.findOne({ _id: req.params.attemptId, userId: req.user.sub });
  if (!attempt) return next(new AppError(404, 'Attempt not found'));

  const answers = req.body.answers || [];
  const questions = await QuizQuestion.find({ _id: { $in: attempt.questionIds } });
  const byId = new Map(questions.map((q) => [q._id.toString(), q]));

  let correct = 0;
  const resultAnswers = answers.map((a) => {
    const question = byId.get(a.questionId);
    const isCorrect = question && String(question.correctAnswer).trim().toLowerCase() === String(a.userAnswer).trim().toLowerCase();
    if (isCorrect) correct += 1;
    return { ...a, isCorrect };
  });

  const total = attempt.questionIds.length || 1;
  attempt.answers = resultAnswers;
  attempt.submittedAt = new Date();
  attempt.score = correct;
  attempt.accuracy = Math.round((correct / total) * 100);
  await attempt.save();

  res.json({ score: attempt.score, accuracy: attempt.accuracy, answers: resultAnswers });
};

export const quizHistory = async (req, res) => {
  res.json(await QuizAttempt.find({ userId: req.user.sub }).sort({ createdAt: -1 }).limit(20));
};
