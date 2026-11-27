# Development journey: NightShift.exe API

Student: Jovelyn G. Pestaño · Section: 3-2 · Group: 1

One entry per milestone, written the week you did it. Newest at the bottom.

## M1 · Accounts, passwords and tokens
- Dates worked: [e.g. Nov 26 to Nov 27, 2026] · Time spent: [e.g. 4 hours]
- Goal: Replace the temporary X-Demo-User stand-in with real user registration, bcrypt password hashing, JWT login tokens, and admin role management.
- What I built: `db/migrations/20261127133114-add-password-to-users.js`, `db/seeders/20261127133350-demo-passwords.js`, `src/validators/auth.validator.js`, `src/services/auth.service.js`, `src/services/user.service.js`, `src/controllers/auth.controller.js`, `src/controllers/user.controller.js`, `src/routes/auth.routes.js`, `src/routes/user.routes.js`, updated `src/errors/constraint-map.js`, `src/routes/index.js`, `src/config/env.js`, and the 38-request Postman suite in `postman/nightshift-week11.postman_collection.json`.
- Evidence: [PR # link after opening PR] · `d3a97b5` (plus latest auth & Postman commits)
- Problem I hit: `password.js` read `env.bcryptRounds` which was missing from `src/config/env.js`, and all Postman logins returned 401 because the collection's `demoPassword` variable (`NightShift-2026`) did not match the seeded password (`NightShift.exe-2026`).
- How I solved it: Added `bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10` to `env.js`, checked stored hashes against `password.matches()` using a quick Node script, and aligned `demoPassword` in the Postman collection and `README.md` (`38 requests, 47 assertions, 0 failed` in Newman).
- Decision I made and why: Excluded `role` from `registerRules` in `auth.validator.js` so `matchedData` strips any client-supplied `"role": "ADMIN"` and `auth.service.js` always assigns `PLAYER`. The cost is that hosts cannot self-register as `HOST` and must be promoted by an `ADMIN` via `PATCH /users/:id/role`.
- Changes to my design set: Added `password_hash` (`VARCHAR(60)`, nullable for migration compatibility) to `users`, and added `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `GET /users`, and `PATCH /users/:id/role` to the endpoint table.
- What I would explain to a classmate: `POST /auth/login` uses a dummy bcrypt hash when the `school_id` does not exist and returns the exact same `401 INVALID_CREDENTIALS` as a wrong password so attackers cannot use response times or error messages to guess which school IDs are registered.
- AI tools: Used an AI coding assistant to debug `EADDRINUSE` / `env.bcryptRounds` / Newman 401 mismatches and to structure step-by-step M1 files while testing and verifying every endpoint locally.

## M2 · The question bank

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report