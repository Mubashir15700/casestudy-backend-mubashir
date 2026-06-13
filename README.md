# Wallet Service Backend

## Overview

Wallet Service Backend is a Node.js, TypeScript, Express, PostgreSQL, and Prisma based wallet system that supports:

* User registration and authentication
* JWT access and refresh token flow
* Wallet management
* Wallet-to-wallet transfers
* Transaction history
* Background job processing
* Payment webhook handling

---

## Setup

### Prerequisites

* Node.js 20+
* PostgreSQL 15+
* npm

### Clone Repository

```bash
git clone https://github.com/Mubashir15700/casestudy-backend-mubashir.git
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file using `.env.example`.

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Migrations

```bash
npx prisma migrate deploy
```

### Start Development Server

```bash
npm run dev
```

Server runs on:

```text
http://localhost:3000
```

---

## Environment Variables

See `.env.example`.

| Variable                 | Description                               |
| ------------------------ | ----------------------------------------- |
| PORT                     | Application port                          |
| DATABASE_URL             | PostgreSQL connection string              |
| JWT_ACCESS_SECRET        | Access token signing secret               |
| JWT_REFRESH_SECRET       | Refresh token signing secret              |
| ACCESS_TOKEN_EXPIRES_IN  | Access token lifetime                     |
| REFRESH_TOKEN_EXPIRES_IN | Refresh token lifetime                    |
| ADMIN_API_KEY            | API key used for wallet credit operations |

---

## Running the Worker

Start the background worker in a separate terminal:

```bash
npm run worker
```

The worker polls the jobs table every 5 seconds and processes queued jobs.

---

## Running Migrations

Development:

```bash
npx prisma migrate dev
```

Production:

```bash
npx prisma migrate deploy
```

---

## API Overview

| Method | Endpoint          | Description                             |
| ------ | ----------------- | --------------------------------------- |
| POST   | /auth/register    | Register user and create wallet         |
| POST   | /auth/login       | Login and receive access/refresh tokens |
| POST   | /auth/refresh     | Rotate refresh token                    |
| POST   | /auth/logout      | Revoke refresh token                    |
| GET    | /users/me         | Get current user profile                |
| GET    | /wallets/me       | Get current wallet details              |
| POST   | /wallets/credit   | Admin wallet credit operation           |
| POST   | /wallets/transfer | Transfer funds between wallets          |
| GET    | /transactions     | List user transactions                  |
| GET    | /transactions/:id | Get transaction details                 |
| POST   | /webhooks/payment | Receive payment webhook                 |

---

## Design Decisions

### Authentication

JWT-based authentication using short-lived access tokens and refresh token rotation.

### Wallet Transfers

Transfers execute inside a database transaction to guarantee consistency between debit and credit operations.

### Idempotency

Transfers support idempotency using a unique idempotency key to prevent duplicate processing.

### Background Jobs

Jobs are stored in PostgreSQL and processed asynchronously by a dedicated worker process.

### Concurrency Control

Jobs use a claimed_at mechanism to prevent multiple workers from processing the same job simultaneously.

---

## Assumptions

* Each user owns exactly one wallet.
* All balances are stored as integer values representing the smallest currency unit.
* Wallet credit operations are restricted to administrators.
* Payment webhooks are trusted and do not require signature verification for this exercise.

---

## What I Would Do Differently

With additional time I would:

* Implement PostgreSQL row-level locking using FOR UPDATE SKIP LOCKED.
* Add webhook signature verification.
* Add comprehensive automated integration tests.
* Introduce Redis-backed queues for higher throughput.
* Add role-based access control instead of API-key based administration.
* Add observability using structured logging and metrics.
