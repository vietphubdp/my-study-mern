import { Router } from 'express';
import {
  createCourse,
  createLesson,
  createNote,
  createTopic,
  deleteCourse,
  listCourses,
  listLessons,
  listNotes,
  listTopics,
  updateCourse,
} from '../controllers/contentController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/courses', asyncHandler(listCourses));
router.post('/courses', asyncHandler(createCourse));
router.patch('/courses/:id', asyncHandler(updateCourse));
router.delete('/courses/:id', asyncHandler(deleteCourse));
router.get('/courses/:courseId/topics', asyncHandler(listTopics));
router.post('/courses/:courseId/topics', asyncHandler(createTopic));
router.get('/topics/:topicId/lessons', asyncHandler(listLessons));
router.post('/topics/:topicId/lessons', asyncHandler(createLesson));
router.get('/notes', asyncHandler(listNotes));
router.post('/notes', asyncHandler(createNote));

export default router;
