import { Router } from 'express';
import { createQuestion, listQuestions, quizHistory, startQuiz, submitQuiz } from '../controllers/quizController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/questions', asyncHandler(listQuestions));
router.post('/questions', asyncHandler(createQuestion));
router.post('/start', asyncHandler(startQuiz));
router.post('/:attemptId/submit', asyncHandler(submitQuiz));
router.get('/history', asyncHandler(quizHistory));

export default router;
