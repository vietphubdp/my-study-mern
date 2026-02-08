# My Study MERN

Ứng dụng học tập fullstack theo kiến trúc MERN với các chức năng cốt lõi đã code:

- Auth email/password, JWT access + refresh token rotation.
- RBAC: `admin`, `editor`, `user`.
- CRUD nội dung học tập: Course / Topic / Lesson / Note.
- Flashcards Q/A + Leitner spaced repetition.
- Quiz (MCQ/True-False/Fill-blank) + random đề + lưu attempt.
- Dashboard summary: due cards, accuracy, study time.

## Cấu trúc

- `server/`: Express + MongoDB API.
- `client/`: React + Vite web app.
- `docs/`: tài liệu architecture/roadmap.

## Quick start

### 1) Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Backend mặc định chạy tại `http://localhost:4000`.

### 2) Frontend

```bash
cd client
npm install
npm run dev
```

Frontend chạy tại `http://localhost:5173`.

## API chính

- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`
- `GET/POST/PATCH/DELETE /api/courses`
- `GET/POST /api/courses/:courseId/topics`
- `GET/POST /api/topics/:topicId/lessons`
- `GET/POST /api/notes`
- `GET/POST /api/flashcards`, `GET /api/flashcards/due`, `POST /api/flashcards/:id/review`
- `GET/POST /api/quiz/questions`, `POST /api/quiz/start`, `POST /api/quiz/:attemptId/submit`
- `GET /api/dashboard/summary`

## Ghi chú bảo mật

- Access token TTL ngắn, refresh token lưu httpOnly cookie.
- Refresh token rotation + revoke.
- Password hash bằng bcrypt.

