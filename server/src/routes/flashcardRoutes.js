import { Router } from 'express';
import { createFlashcard, dueFlashcards, listFlashcards, reviewFlashcard } from '../controllers/flashcardController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/', asyncHandler(listFlashcards));
router.post('/', asyncHandler(createFlashcard));
router.get('/due', asyncHandler(dueFlashcards));
router.post('/:id/review', asyncHandler(reviewFlashcard));

export default router;
