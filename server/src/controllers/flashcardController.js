import { Flashcard } from '../models/Flashcard.js';

const intervalsByBox = { 1: 1, 2: 2, 3: 4, 4: 7, 5: 14 };

export const createFlashcard = async (req, res) => {
  const card = await Flashcard.create({ ...req.body, ownerId: req.user.sub });
  res.status(201).json(card);
};

export const listFlashcards = async (req, res) => {
  const filter = { ownerId: req.user.sub };
  if (req.query.tag) filter.tags = req.query.tag;
  res.json(await Flashcard.find(filter).sort({ nextReviewAt: 1 }));
};

export const dueFlashcards = async (req, res) => {
  res.json(await Flashcard.find({ ownerId: req.user.sub, nextReviewAt: { $lte: new Date() } }).sort({ nextReviewAt: 1 }));
};

export const reviewFlashcard = async (req, res, next) => {
  const { quality } = req.body;
  const card = await Flashcard.findOne({ _id: req.params.id, ownerId: req.user.sub });
  if (!card) return next(new Error('Card not found'));

  if (quality >= 3) {
    card.leitnerBox = Math.min(5, card.leitnerBox + 1);
  } else {
    card.leitnerBox = 1;
  }

  const days = intervalsByBox[card.leitnerBox] || 1;
  card.lastReviewedAt = new Date();
  card.nextReviewAt = new Date(Date.now() + days * 86400000);
  await card.save();
  res.json(card);
};
