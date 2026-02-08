# Architecture & Data Model (MERN)

## 1. High-level architecture

- **React SPA** gọi API qua HTTPS.
- **Express API** xử lý auth, business logic, phân quyền.
- **MongoDB** lưu user/content/progress.
- **Cloudinary/S3** lưu media attachments.

## 2. RBAC matrix

| Action | user | editor | admin |
|---|---:|---:|---:|
| Quản lý nội dung của chính mình | ✅ | ✅ | ✅ |
| Quản lý nội dung public hệ thống | ❌ | ✅ | ✅ |
| Duyệt report/moderation | ❌ | ❌ | ✅ |
| Quản lý user/role | ❌ | ❌ | ✅ |

## 3. Collections gợi ý

## `users`
- `_id`
- `email` (unique)
- `passwordHash`
- `role` (`user|editor|admin`)
- `emailVerified` (bool)
- `profile` `{ displayName, avatarUrl, bio }`
- `privacy` `{ profileVisibility: private|public }`
- `createdAt`, `updatedAt`

## `refreshTokens`
- `_id`
- `userId`
- `tokenHash`
- `expiresAt`
- `revokedAt`
- `userAgent`, `ip`

## `courses`
- `_id`, `ownerId`
- `title`, `description`
- `visibility` (`private|unlisted|public`)
- `tags[]`
- `forkedFromCourseId?`

## `topics`
- `_id`, `courseId`, `ownerId`
- `title`, `order`

## `lessons`
- `_id`, `topicId`, `ownerId`
- `title`, `markdownContent`
- `attachments[]`
- `tags[]`, `order`

## `notes`
- `_id`, `lessonId?`, `ownerId`
- `title`, `markdownContent`
- `tags[]`, `attachments[]`

## `flashcards`
- `_id`, `ownerId`
- `question`, `answer`
- `tags[]`, `topicId?`, `lessonId?`
- `leitnerBox` (1..5)
- `nextReviewAt`
- `lastReviewedAt`

## `quizQuestions`
- `_id`, `ownerId`
- `type` (`mcq|true_false|fill_blank`)
- `prompt`
- `options[]` (với MCQ)
- `correctAnswer`
- `explanation`
- `tags[]`, `topicId?`

## `quizAttempts`
- `_id`, `userId`
- `quizConfig` (tag/topic/random/timeLimit)
- `startedAt`, `submittedAt`
- `score`, `accuracy`
- `answers[]` `{ questionId, userAnswer, isCorrect, timeSpentSec }`

## `studySessions`
- `_id`, `userId`
- `startedAt`, `endedAt`
- `durationSec`
- `activityType` (`flashcard|quiz|reading`)

## `reports` (social phase)
- `_id`, `reporterId`
- `targetType` (`course|lesson|flashcard`)
- `targetId`
- `reason`
- `status` (`open|reviewing|resolved|rejected`)

## 4. API surface (MVP)

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/verify-email/:token` (optional)

### Content
- `GET/POST /courses`
- `GET/PATCH/DELETE /courses/:id`
- `GET/POST /courses/:id/topics`
- `GET/POST /topics/:id/lessons`
- `GET/POST /notes`

### Flashcards + quiz
- `GET/POST /flashcards`
- `POST /flashcards/:id/review`
- `GET /flashcards/due`
- `GET/POST /quiz/questions`
- `POST /quiz/start`
- `POST /quiz/:attemptId/submit`

### Analytics
- `GET /dashboard/summary`
- `GET /dashboard/heatmap` (phase 2)
- `GET /export?format=csv|json`
- `POST /import`

## 5. Security baseline

- Password hash: Argon2 hoặc bcrypt (cost cao hợp lý).
- Access token TTL ngắn (10-20 phút), refresh dài hơn (7-30 ngày).
- Refresh token rotation + revoke list.
- Rate limit cho login, forgot-password.
- Validate input bằng zod/joi.
- Audit log cho hành động admin.

