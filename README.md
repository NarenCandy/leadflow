# LeadFlow — Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack, TypeScript, and TailwindCSS. Built as part of the ServiceHive Full Stack Internship Assignment.

## Live Demo

- **Frontend:** [Click this](https://leadflow-rose-mu.vercel.app/)
- **Backend API:** [click this(might take few minutes to load)](https://leadflow-backend-oh0z.onrender.com)

---

## Tech Stack

### Frontend
- React.js + TypeScript
- TailwindCSS with Dark Mode
- React Query for data fetching and caching
- React Router v7
- Axios with request and response interceptors

### Backend
- Node.js + Express.js + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator for request validation

### DevOps
- Docker + Docker Compose
- Multi-stage builds using Node 20 Alpine and Nginx Alpine

---

## Features

- JWT-based Authentication — Register, Login, Protected Routes
- Leads CRUD — Create, Read, Update, Delete
- View Single Lead Details
- Advanced Filtering — Status, Source, Search by name or email, Sort by latest or oldest
- Multiple filters work together simultaneously
- Backend Pagination — 10 records per page with full metadata
- Role-Based Access Control — Admin and Sales roles
- CSV Export with active filter support
- Debounced Search — 500ms delay to reduce API calls
- Dark Mode — persisted to localStorage with system preference detection
- Responsive Design across all screen sizes
- Loading states, Empty states, and Error states throughout the UI
- Form validation on all forms — client side and server side

---

## Role Permissions

| Action | Admin | Sales |
|---|---|---|
| View all leads | Yes | No — own leads only |
| View single lead | Yes | No — own leads only |
| Create lead | Yes | Yes |
| Update lead | Yes | No — own leads only |
| Delete lead | Yes | No |
| Export CSV | Yes — all leads | Yes — own leads only |
| Manage users | Yes | No |

---

## Project Structure

```
leadflow/
├── server/                     Backend — Node + Express + TypeScript
│   ├── src/
│   │   ├── config/             Database connection
│   │   ├── controllers/        Route handler logic
│   │   ├── middleware/         Auth, validation, error handler
│   │   ├── models/             Mongoose schemas with TypeScript interfaces
│   │   ├── routes/             Express routers
│   │   ├── types/              Shared TypeScript interfaces and enums
│   │   └── utils/              Helper functions — AppError, CSV export
│   ├── Dockerfile
│   ├── .env.example
│   └── tsconfig.json
│
├── client/                     Frontend — React + TypeScript
│   ├── src/
│   │   ├── api/                Axios instance and API call functions
│   │   ├── components/         Reusable UI components
│   │   │   ├── layout/         Navbar
│   │   │   ├── leads/          LeadsTable, LeadFormModal, DeleteModal, LeadDetailModal
│   │   │   └── ui/             Button, Input, Badge, Pagination
│   │   ├── context/            AuthContext and ThemeContext
│   │   ├── hooks/              useDebounce custom hook
│   │   ├── pages/              LoginPage, RegisterPage, DashboardPage
│   │   ├── types/              TypeScript interfaces mirroring backend types
│   │   └── utils/              Helper functions
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
│
├── docker-compose.yml          Production Docker setup
├── docker-compose.dev.yml      Development Docker setup
├── .env.example                Root env template for Docker
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js version 20 or higher
- MongoDB installed locally or a MongoDB Atlas URI
- Docker and Docker Compose if using the Docker setup

---

### Option A — Run with Docker (Recommended)

This is the easiest way to run the full project with one command.

Step 1 — Clone the repository

    git clone https://github.com/NarenCandy/leadflow.git
    cd leadflow

Step 2 — Create the root environment file

    cp .env.example .env

Open .env and set a strong JWT_SECRET value.

Step 3 — Build and start all containers

    docker-compose up --build

This starts three containers — MongoDB, the backend API, and the frontend served via Nginx.

- Frontend is available at http://localhost
- Backend API is available at http://localhost:5000

Step 4 — Stop the containers

    docker-compose down

To stop and delete all data including the database volume:

    docker-compose down -v

---

### Option B — Run Locally for Development

Backend setup:

    cd server
    cp .env.example .env

Open server/.env and fill in all values, then run:

    npm install
    npm run dev

The backend starts at http://localhost:5000

Frontend setup (in a new terminal):

    cd client
    cp .env.example .env
    npm install
    npm run dev

The frontend starts at http://localhost:5173

---

## Environment Variables

### Backend — server/.env

    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/leadflow
    JWT_SECRET=your_jwt_secret_here
    JWT_EXPIRES_IN=7d
    NODE_ENV=development

### Frontend — client/.env

    VITE_API_URL=http://localhost:5000/api

### Docker root — .env

    JWT_SECRET=your_jwt_secret_here
    JWT_EXPIRES_IN=7d

---

## API Documentation

See API.md for the full endpoint reference including request and response examples.

---

## Git Commit Convention

This project follows the Conventional Commits standard:

- feat — new feature added
- fix — bug fix
- chore — configuration or setup change
- docs — documentation update
- refactor — code restructure without behaviour change

---

## TypeScript Standards

- Strict mode enabled on both frontend and backend
- All interfaces and types are properly defined
- Enums replaced with const objects for Vite compatibility
- No any usage — unknown with type narrowing used instead
- noUnusedLocals and noUnusedParameters enforced

---

## Author

Built by Naren for the ServiceHive Full Stack Internship Assignment.

Subject: MERN Internship Assignment Submission - Naren
