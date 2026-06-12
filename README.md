# SkillMentor AI

SkillMentor AI is a full-stack MERN learning and career preparation platform that helps users track coding practice, follow career roadmaps, prepare for interviews, review resumes with AI, manage courses, and monitor progress through a real-time analytics dashboard.

## Features

- User authentication with JWT
- Email verification and password reset
- AI Mentor chat
- AI resume review and ATS feedback
- Coding practice tracker
- Career roadmap tracker
- AI interview preparation
- AI mock interview evaluation
- Course enrollment and progress tracking
- Notes management
- Real-time dashboard analytics
- Streak and achievement tracking
- MongoDB-powered data persistence

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Multer
- Nodemailer
- Gemini AI / AI API integration

## Project Structure

```bash
SkillMentor/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   └── assets/
│
├── skillmentor-backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validators/
│   │   └── utils/