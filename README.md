# Aisel Patients Management System

A full-stack Patient Management System built for the Aisel technical case. It includes a secure backend API with role-based access and a responsive frontend interface. The system supports creating, reading, updating, and deleting patient records, with authentication and authorization.

## 🔧 Tech Stack

### 🖥️ Frontend

- **Framework:** React (via Next.js)
- **Styling:** Tailwind CSS + Shadcn/ui
- **Auth:** JWT token-based
- **Hosting:** Vercel (TBA)

### ⚙️ Backend

- **Framework:** NestJS
- **Database:** PostgreSQL (via Railway - TBA)
- **ORM:** Prisma
- **Authentication:** JWT with Passport.js
- **Dockerized:** Multi-stage `Dockerfile`

### ☁️ Cloud & DevOps _(work in progress)_

- **Backend Hosting:** Railway
- **Database Hosting:** Railway Postgres
- **CI/CD:** Railway + Vercel
- **Containerization:** Docker + Docker Compose

## 🛠️ Local Setup

### 1. Clone and install

```bash
git clone https://github.com/baldurlogi/aisel-pms.git
cd aisel-pms
corepack enable
pnpm install --frozen-lockfile
```

### 2. Create Environment Variables

#### apps/api/.env

```env
PORT=4000
JWT_SECRET="super-strong-random-string"
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb"
```

#### apps/web/.env

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Run Locally (without Docker for now)

> Note: replace pnpm with npm or yarn if preferred.

#### Build shared library:

```bash
pnpm --filter dtos run build
```

#### DB - From root:

```bash
pnpm --filter api exec prisma db push --schema=src/prisma/schema.prisma
pnpm --filter api exec prisma studio --schema=src/prisma/schema.prisma
```

#### Bakcend - From root:

```bash
cd apps/api
pnpm run clean
pnpm run build
pnpm run start  # Nest app on http://localhost:4000
```

#### Frontend - From root:

```bash
pnpm --filter web dev # Next.js on http://localhost:3000
```

## 👤 Authentication

- **ADMIN**: Full CRUD access
- **USER**: Read-only access

### 1. Hash a password

```bash
cd apps/api
node
const bcrypt = require('bcryptjs');
bcrypt.hashSync('<your_password>', 10);
```

### 2. Copy the hashed password

something like: '$2b$10$HP5Bgcq4TJvw6Jxd4xB2eOO1XMh7.GAmez9f/iqNRqh0KpiPyAw8.'

### 3. Go to the Prisma studio (usually localhost:5555) and make a user with:

```json
{
  "email": "your.name@example.com",
  "password": <hashed_password>,
  "role": "ADMIN"
}
```

## 👤 Log in and see patient list

### 1. Open http://localhost:3000 → redirected to /login.

### 2. Sign in with the admin credentials above

### 3. You’ll land on /patients, where full CRUD is enabled.

## 🧪 Testing

> Not implemented fully — but testing hooks can be added using `@nestjs/testing`, `jest`, and `supertest`.

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
