# Assignment Internshala - Task Manager

A full-stack Task Manager application built with Node.js, Express, MongoDB, and Vanilla JavaScript.

## Project Overview

This project provides:
- User authentication with JWT
- Task CRUD operations (create, read, update, delete)
- Admin endpoints for user and system statistics
- Swagger API documentation
- Simple frontend UI for register, login, and dashboard flows

## Tech Stack

- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JSON Web Tokens (JWT), bcryptjs
- Security/Middleware: helmet, cors, express-rate-limit, morgan
- API Docs: swagger-jsdoc, swagger-ui-express
- Frontend: HTML, CSS, Vanilla JavaScript

## Project Structure

```text
project/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── src/
│       ├── app.js
│       ├── config/
│       │   ├── db.js
│       │   └── swagger.js
│       ├── middleware/
│       │   ├── auth.js
│       │   └── validate.js
│       ├── models/
│       │   ├── User.js
│       │   └── Task.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── taskController.js
│       │   └── adminController.js
│       └── routes/v1/
│           ├── auth.js
│           ├── tasks.js
│           └── admin.js
└── frontend/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── api.js
    │   └── tasks.js
    ├── login.html
    ├── register.html
    └── dashboard.html
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local or MongoDB Atlas)

## Setup and Run

### 1. Clone the repository

```bash
git clone https://github.com/AbhirajDhiman/Assignment_internshala.git
cd Assignment_internshala/project
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Update `.env` values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

Start backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

This starts the frontend on `http://127.0.0.1:5500` and opens `login.html`.

## API Information

- Base URL: `http://localhost:5000/api/v1`
- Swagger Docs: `http://localhost:5000/api-docs`

## Available Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /auth/register | No | Register user |
| POST | /auth/login | No | Login user |
| GET | /auth/me | Yes | Get current profile |
| PUT | /auth/me | Yes | Update profile |
| GET | /tasks | Yes | Get all user tasks |
| POST | /tasks | Yes | Create task |
| GET | /tasks/:id | Yes | Get one task |
| PUT | /tasks/:id | Yes | Update task |
| DELETE | /tasks/:id | Yes | Delete task |
| GET | /admin/users | Admin | Get all users |
| GET | /admin/stats | Admin | Get system stats |
| PATCH | /admin/users/:id/toggle | Admin | Toggle user active status |

## Scripts

Inside `backend/package.json`:

- `npm run dev`: Run server with nodemon
- `npm start`: Run server with node

Inside `frontend/package.json`:

- `npm run dev`: Run frontend via live-server on port 5500

## Scalability Notes

To scale this project in production:
- Use horizontal scaling with multiple Node.js instances behind Nginx or a cloud load balancer
- Add Redis for cache, session strategies, and token-related workflows
- Split auth/tasks/admin into dedicated services as the system grows
- Use MongoDB Atlas with replica sets and proper indexing
- Containerize the stack with Docker Compose or Kubernetes
- Add queue workers (Bull/BullMQ) for background jobs

## Author

Abhiraj Dhiman
