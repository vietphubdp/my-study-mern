import { Course } from '../models/Course.js';
import { Topic } from '../models/Topic.js';
import { Lesson } from '../models/Lesson.js';
import { Note } from '../models/Note.js';
import { AppError } from '../utils/appError.js';

const ownerFilter = (user) => (user.role === 'admin' || user.role === 'editor' ? {} : { ownerId: user.sub });

export const createCourse = async (req, res) => {
  const course = await Course.create({ ...req.body, ownerId: req.user.sub });
  res.status(201).json(course);
};

export const listCourses = async (req, res) => {
  const q = req.query.q;
  const filter = { ...ownerFilter(req.user) };
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (req.query.tag) filter.tags = req.query.tag;
  res.json(await Course.find(filter).sort({ updatedAt: -1 }));
};

export const updateCourse = async (req, res, next) => {
  const filter = { _id: req.params.id, ...ownerFilter(req.user) };
  const course = await Course.findOneAndUpdate(filter, req.body, { new: true });
  if (!course) return next(new AppError(404, 'Course not found'));
  res.json(course);
};

export const deleteCourse = async (req, res, next) => {
  const filter = { _id: req.params.id, ...ownerFilter(req.user) };
  const course = await Course.findOneAndDelete(filter);
  if (!course) return next(new AppError(404, 'Course not found'));
  await Topic.deleteMany({ courseId: course._id });
  res.json({ message: 'Deleted' });
};

export const createTopic = async (req, res) => {
  const topic = await Topic.create({ ...req.body, courseId: req.params.courseId, ownerId: req.user.sub });
  res.status(201).json(topic);
};

export const listTopics = async (req, res) => {
  res.json(await Topic.find({ courseId: req.params.courseId, ...ownerFilter(req.user) }).sort({ order: 1 }));
};

export const createLesson = async (req, res) => {
  const lesson = await Lesson.create({ ...req.body, topicId: req.params.topicId, ownerId: req.user.sub });
  res.status(201).json(lesson);
};

export const listLessons = async (req, res) => {
  const filter = { topicId: req.params.topicId, ...ownerFilter(req.user) };
  if (req.query.tag) filter.tags = req.query.tag;
  res.json(await Lesson.find(filter).sort({ order: 1 }));
};

export const createNote = async (req, res) => {
  const note = await Note.create({ ...req.body, ownerId: req.user.sub });
  res.status(201).json(note);
};

export const listNotes = async (req, res) => {
  const filter = { ...ownerFilter(req.user) };
  if (req.query.q) filter.title = { $regex: req.query.q, $options: 'i' };
  if (req.query.tag) filter.tags = req.query.tag;
  res.json(await Note.find(filter).sort({ updatedAt: -1 }));
};
