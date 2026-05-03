# Patient Registration Challenge

A full-stack patient registration app built with **Next.js**, **Express**, **PostgreSQL**, and **Prisma**.

---

## Prerequisites

Make sure the following are installed before you begin:

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+ — `npm install -g pnpm`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for the PostgreSQL database)

---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd patient-registration-challenge
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create the backend `.env` file:

```bash
cp packages/backend/.env.example packages/backend/.env
```

Then open `packages/backend/.env` and fill in your Mailtrap credentials if you would like to test the email delivery after successfull register.

```env
DATABASE_URL="postgresql://patient_user:patient_pass@localhost:5432/patient_db"

# Mailtrap SMTP sandbox — https://mailtrap.io
SMTP_HOST="sandbox.smtp.mailtrap.io"
SMTP_PORT="2525"
SMTP_USER="<your-mailtrap-user>"
SMTP_PASS="<your-mailtrap-password>"
SMTP_FROM="\"Patient Registration\" <no-reply@patient-app.dev>"
```

### 4. Start the database

```bash
pnpm docker:up
```

This starts a PostgreSQL 16 container on port `5432`. Wait a few seconds for it to become healthy.

### 5. Run database migrations

```bash
cd packages/backend
pnpm exec prisma migrate deploy
cd ../..
```

---

## Running the app

Start both the frontend and backend in development mode:

```bash
pnpm dev:all
```

Or start them separately:

```bash
pnpm dev:frontend   # Next.js → http://localhost:3000
pnpm dev:backend    # Express → http://localhost:3001
```

---

## Seeding the database (optional)

To populate the database with 100 mock patients for testing:

```bash
pnpm db:seed
```

To wipe all patient records:

```bash
pnpm db:clear
```

---

## Available scripts

| Script | Description |
|---|---|
| `pnpm dev:all` | Start frontend + backend concurrently |
| `pnpm dev:frontend` | Start Next.js dev server |
| `pnpm dev:backend` | Start Express dev server |
| `pnpm docker:up` | Start the PostgreSQL container |
| `pnpm docker:down` | Stop the PostgreSQL container |
| `pnpm docker:logs` | Follow Docker container logs |
| `pnpm db:seed` | Insert 100 mock patients |
| `pnpm db:clear` | Delete all patients from the database |

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4, Redux Toolkit, Framer Motion |
| Backend | Express, Prisma 7, PostgreSQL 16 |
| Validation | Zod v4, react-hook-form |
| Email | Nodemailer + Mailtrap SMTP sandbox |
| Monorepo | pnpm workspaces |
