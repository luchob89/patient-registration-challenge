# Patient Registration Challenge

A full-stack patient registration app: a multi-step form (personal info, contact, and an ID photo captured via camera or file upload) backed by an Express + PostgreSQL API, plus a paginated, sortable list of registered patients.

This was originally built as a take-home coding challenge for a company, as part of a job interview process.

## Screenshots

| Home | Registration form | Camera capture | Patients list |
| --- | --- | --- | --- |
| ![Home screen](docs/screenshot-home.png) | ![Registration form](docs/screenshot-form.png) | ![Camera capture](docs/screenshot-camera.png) | ![Patients list](docs/screenshot-patients.png) |

---

## Features

- **Multi-step registration form** (name, email, phone, ID photo) with validation mirrored on both the client (Zod + react-hook-form) and the server (Zod), so the API is never trusted to the frontend alone.
- **Live duplicate-email check**: the email step calls the API as you submit it and blocks you from continuing if that address is already registered.
- **ID photo capture two ways**: drag-and-drop / click-to-browse upload (JPEG, 5 MB max) via `react-dropzone`, or a live in-browser camera capture (with front/back camera toggle on supported devices) — either way, the photo can be rotated before submitting.
- **Patient list** with pagination, sorting by name/email/registration date (case-insensitive), loading skeletons, an empty state, and an error state with retry.
- **Email notifications**: a confirmation email is sent via Nodemailer/Mailtrap on successful registration, with a "resend" endpoint. The notification logic is written as a small abstraction so SMS can be dropped in later without touching other files.
- Patient photos are stored in PostgreSQL and served back through a dedicated `/patients/:id/photo` endpoint rather than exposed as static files.

---

## Prerequisites

Make sure the following are installed before you begin:

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+ — `npm install -g pnpm`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for the PostgreSQL database)

---

## Setup

### 1. Get the source code

**If the repository is public**, clone it:

```bash
git clone https://github.com/luchob89/patient-registration-challenge.git
cd patient-registration-challenge
```

**If you received a `.zip` file**, extract it and navigate into the project root:

```bash
unzip patient-registration-challenge.zip
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

---

## What I'd change for production

This was built to a specific challenge brief, so a few things make sense to call out:

- **Authentication**: there's no login or access control — anyone who can reach the API can list, create, or delete patient records. A real app handling patient data needs real auth and authorization.
- **Email domain restriction**: registration only accepts `@gmail.com` addresses. This was a specific requirement of the original challenge, not a real-world constraint — production would accept any valid email.
- **CORS**: the API currently allows all origins (`cors()` with no options). Fine for a local/demo setup, but a real deployment would restrict this to the actual frontend origin.
- **Tests and CI**: there's no automated test suite or CI pipeline yet — both would be key before this handled real patient data.
- **SMS notifications**: `notifications.ts` is already structured for it, but it's not implemented — see the TODO in that file.
