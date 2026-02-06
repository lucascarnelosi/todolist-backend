# TodoList Server

A simple, well-tested REST API for a Todo application built with Node.js, Express, TypeScript and Prisma (SQLite). It implements JWT access tokens and refresh tokens (stored as DB records and sent in an HTTP-only cookie).

**Tech stack**
- Node.js + TypeScript
- Express
- Prisma ORM with SQLite (adapter: @prisma/adapter-better-sqlite3)
- JWT for authentication
- Jest + SuperTest for tests

**Features**
- User registration and authentication (access token + refresh token)
- Protected task CRUD (create, list, update, toggle complete, delete)
- Refresh token rotation via HTTP-only cookie
- Minimal, focused test suite for auth and task flows

---

**Quick start (development)**

Prerequisites
- Node.js 18+ (recommended)
- Yarn or npm

Install dependencies

```bash
npm install
```

Environment
- Create a `.env` in the project root for environment secrets.
- The app will use `process.env.JWT_SECRET` for signing tokens; a default is provided in code for local dev.

Example `.env` (recommended):

```text
JWT_SECRET=your-production-secret
```

Start server (dev watch)

```bash
npm run dev
```

The server listens on `http://localhost:3333` by default. CORS allows origin `http://localhost:5173`.

---

**Database / Prisma**
- This project uses Prisma with SQLite. The adapter points at `file:./prisma/dev.db` in development.
- Migrations are stored under `prisma/migrations`.

To run Prisma migrate locally (if you change schema):

```bash
npx prisma migrate dev --name your_change
npx prisma generate
```

Note: tests run with `NODE_ENV=test` and use the `prisma` client configured in `src/prisma.ts`.

---

**Scripts** (from `package.json`)
- `npm run dev` — start server with `tsx` in watch mode
- `npm test` — run Jest tests with `NODE_ENV=test` and `.env.test`

---

**Authentication flow**
- Login: `POST /sessions` with `{ email, password }` returns user and an access token (JWT) in JSON.
- Refresh: `POST /refresh-token` reads a `refreshToken` cookie, validates it against DB and returns a new access token.
- Logout: `POST /logout` clears `refreshToken` cookie and removes the refresh token from DB.
- Protected endpoints require header `Authorization: Bearer <accessToken>`.
- Refresh tokens are stored in `RefreshToken` table and have an expiration (7 days by default).

---

**API Endpoints (overview & examples)**

Auth & user
- `POST /users` — create user
  - Body: `{ name, email, password }`

- `POST /sessions` — login
  - Body: `{ email, password }`
  - Response: `{ user, token }` and sets a `refreshToken` HTTP-only cookie

- `POST /refresh-token` — issue new access token from refresh-token cookie
  - Requires `refreshToken` cookie
  - Response: `{ token }`

- `POST /logout` — clears cookie and removes refresh token

Protected user
- `GET /users/me` — get current user
  - Requires `Authorization: Bearer <token>`

Tasks (all require authentication)
- `GET /tasks` — list user's tasks
- `POST /tasks` — create task (body `{ title }`)
- `PATCH /tasks/:id` — update title (body `{ title }`)
- `PATCH /tasks/:id/toggle` — toggle completed state
- `DELETE /tasks/:id` — delete task

Example: create a task

```bash
# Set ACCESS_TOKEN from login response
curl -X POST http://localhost:3333/tasks \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk"}'
```

Notes about refresh token usage: the refresh token is set as a cookie named `refreshToken` by `POST /sessions`. When calling `POST /refresh-token` use the cookie (e.g., using a browser or an HTTP client that preserves cookies).

---

**Testing**
- Tests run with `NODE_ENV=test` and expect `.env.test` (project provides `npm test` which loads `.env.test`).

Run tests:

```bash
npm test
```

The test harness clears `user`, `task` and `refreshToken` tables between tests (`src/tests/setup.ts`).

---

**Project layout (key files)**
- `src/server.ts` — Express app entry
- `src/routes` — route definitions
- `src/controllers` — request handlers (User, Session, Task, RefreshToken, Logout, Health)
- `src/middlewares/ensureAuthenticated.ts` — JWT guard for protected routes
- `src/prisma.ts` — Prisma client configuration
- `prisma/schema.prisma` — DB schema and models
- `tests/*` — Jest tests