# My Study MERN – Product Blueprint

Tài liệu này chuyển danh sách tính năng của bạn thành một blueprint triển khai theo hướng **MERN** (MongoDB, Express, React, Node.js) để có thể bắt đầu làm MVP và mở rộng dần.

## 1) Mục tiêu sản phẩm

Một nền tảng học tập cá nhân (private-first), hỗ trợ:
- Quản lý nội dung học tập theo Course/Topic/Lesson/Note.
- Ôn tập chủ động bằng Flashcards + Quiz.
- Theo dõi tiến độ học tập theo ngày/tuần/tháng.
- Mở rộng social khi sẵn sàng công khai nội dung.

## 2) Feature set theo module

### A. Người dùng & phân quyền
- Đăng ký/đăng nhập với email + password.
- JWT access token + refresh token rotation.
- Quên mật khẩu (email reset link).
- Xác thực email (optional, bật sau).
- RBAC role: `admin`, `editor`, `user`.
- Hồ sơ public là tùy chọn, mặc định riêng tư.

### B. Nội dung học tập
- Cấu trúc: Course -> Topic -> Lesson -> Note.
- Lesson/Note hỗ trợ Markdown editor.
- Tagging + search + filter.
- Upload file/hình đính kèm (ưu tiên Cloudinary cho MVP).

### C. Ôn tập & câu hỏi
- Flashcards (Q/A).
- Spaced repetition: bắt đầu Leitner (dễ triển khai), sau đó nâng cấp SM-2.
- Quiz: MCQ / True-False / Fill-blank.
- Sinh đề random theo tag/topic, có giới hạn thời gian.
- Lưu lịch sử làm bài + phân tích lỗi theo câu/chủ đề.

### D. Tiến độ & thống kê
- Dashboard: streak, số thẻ đến hạn, accuracy, thời gian học.
- Heatmap kiểu GitHub (phase 2).
- Export CSV/JSON, Import backup.

### E. Social (phase mở rộng)
- Share course/lesson: public, unlisted, private.
- Fork/copy bộ thẻ về tài khoản cá nhân.
- Report nội dung + moderation cho admin.

## 3) Ưu tiên triển khai (MVP -> V2)

- **MVP (6-8 tuần):** Auth + RBAC cơ bản, Content CRUD, Flashcards Leitner, Quiz cơ bản, Dashboard tối thiểu.
- **V1.5:** Search tốt hơn, upload file ổn định, export/import.
- **V2:** Social sharing, moderation, heatmap, nâng cấp SM-2.

## 4) Tài liệu chi tiết

- Kiến trúc backend/frontend + data model: `docs/architecture.md`
- Kế hoạch release theo sprint: `docs/roadmap.md`

## 5) Tech stack đề xuất

- **Frontend:** React + Vite + TypeScript + React Query + Zustand + Tailwind.
- **Backend:** Node.js + Express + TypeScript + Mongoose.
- **DB:** MongoDB Atlas.
- **Auth:** JWT (short-lived) + refresh token rotation + httpOnly cookie.
- **Storage:** Cloudinary (MVP), có thể đổi S3 sau.
- **Queue/Jobs (optional):** BullMQ + Redis (email/reminder analytics).
- **Deployment:** Docker + Render/Railway/Fly (API), Vercel (web).

