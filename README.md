# Aisel Patients Management System

A full-stack Patient Management System built for the Aisel technical case. It includes a secure backend API with role-based access and a responsive frontend interface. The system supports creating, reading, updating, and deleting patient records, with authentication and authorization.

## 🔧 Tech Stack

### 🖥️ Frontend

- **Framework:** React (via Next.js)
- **Styling:** Tailwind CSS + Shadcn/ui
- **Auth:** JWT token-based
- **Hosting:** Vercel

### ⚙️ Backend

- **Framework:** NestJS
- **Database:** PostgreSQL (via Railway)
- **ORM:** Prisma
- **Authentication:** JWT with Passport.js
- **Dockerized:** Yes (multi-stage Dockerfile)

### ☁️ Cloud & DevOps

- **Backend Hosting:** Railway
- **Database:** Railway Postgres
- **CI/CD:** Railway + Vercel (GitHub Actions CI not working)
- **Containerization:** Docker + Docker Compose

## 🚀 Live Demo

- **Frontend:** https://aisel-pms-web-whwd.vercel.app
- **Backend API:** https://aisel-pms-api-production.up.railway.app
- **Swagger Docs:** https://aisel-pms-api-production.up.railway.app/api/docs

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/baldurlogi/aisel-pms.git
cd aisel-pms
```

### 2. Environment Variables

#### Root `.env`

```env
DATABASE_URL=postgresql://username:password@host:port/dbname
```

> You can get this from Railway after creating a PostgreSQL service.

#### apps/api/.env

```env
DATABASE_URL=postgresql://username:password@host:port/dbname
JWT_SECRET=your-secret-string
PORT=4000
```

#### apps/web/.env

```env
NEXT_PUBLIC_API_URL=https://aisel-pms-api-production.up.railway.app
```

### 3. Run Locally with Docker

#### Docker Compose

```bash
docker compose up --build
```

> This sets up the backend container, installs dependencies, pushes the schema with Prisma, and launches the NestJS app.

### 4. Run Locally without Docker

#### Backend

```bash
cd apps/api
pnpm install
pnpm prisma generate --schema=src/prisma/schema.prisma
pnpm prisma db push --schema=src/prisma/schema.prisma
pnpm start:dev
```

#### Frontend

```bash
cd apps/web
pnpm install
pnpm dev
```

## 👤 Authentication

- **Admin**: Full CRUD access
- **User**: Read-only access

Pre-seeded admin user (can be added manually via Prisma Studio or SQL):

```json
{
  "email": "admin@example.com",
  "password": "adminpassword",
  "role": "ADMIN"
}
```

> Passwords are hashed with bcrypt. You can generate a hash using a script or insert raw in development.

## 🧪 Testing

> Not implemented yet — but testing hooks can be added using `@nestjs/testing`, `jest`, and `supertest`.

## 🧰 Features

- Full CRUD API for Patients
- Role-based access with JWT
- Responsive, mobile-first frontend UI
- Prisma schema and migrations
- Clean RESTful design
- Swagger documentation
- Dockerized deployment-ready stack

## ✅ Focus Areas

- Developer experience (pnpm, Docker, env management)
- Clean architecture & modular code
- Full-stack functionality
- Real-world security practices (JWT, bcrypt, role guards)
- Deployment readiness (Railway + Vercel)
