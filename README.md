# Edusign Technical Assessment

## About this session

This is a **pair-programming session**, not a solo exam. You'll work through a real codebase with your interviewer, who will play different roles — colleague, product manager, pair partner — depending on the exercise.

There are no trick questions. We care about **how you think, communicate, and collaborate** — not just whether you produce correct code.

### What we're building

Edusign helps educational institutions manage student attendance. Teachers open attendance sessions, students check in digitally, and the system tracks who's present, late, or absent.

Today you'll be reviewing a feature that was built with AI assistance, and then implementing something together.

---

## Setup

### Prerequisites

- Node.js 18+

That's it — SQLite is embedded, no external database server needed.

### Getting started

```bash
npm install
npm test
```

Tests will fail — that's expected. Part of the session involves making some of them pass.

---

## Session structure

### Part 1 — Code Review (~35 min, no AI tools)

You'll review an attendance check-in feature that was built with AI, comparing the code against the product spec in `REQUIREMENTS.md`. The code is spread across several files — types, configuration, business logic, routes, data access, and notifications. This is about reading code, tracing logic across files, spotting issues, and discussing trade-offs with your interviewer.

### Part 2 — Implementation (~33 min, AI tools encouraged)

You'll implement a feature and fix a bug, using whatever AI tools you normally work with. Your interviewer will pair-program with you.

---

## Key files

| File | Description |
|---|---|
| `REQUIREMENTS.md` | Product spec for the attendance feature — **read this first** |
| `src/types.ts` | Shared TypeScript interfaces (Session, CheckIn, AttendanceRecord, etc.) |
| `src/config.ts` | Application configuration (thresholds, webhook URL) |
| `src/db/database.ts` | Database setup (Knex + SQLite schema) |
| `src/db/store.ts` | Data access layer (queries, CRUD operations) |
| `src/attendance/service.ts` | Business logic (check-in processing, status calculation, overrides) |
| `src/attendance/routes.ts` | Express route handlers |
| `src/notifications.ts` | Notification utilities (Slack webhook, logging) |
| `src/app.ts` | Express app setup |
| `src/signature-validator.ts` | Signature validation utilities |
| `tests/attendance-close.test.ts` | Tests for the endpoint you'll implement |

---

## What we expect from you

- **Think out loud.** Share your reasoning as you go.
- **Ask questions.** If something is unclear, ask — just like you would with a real colleague.
- **Push back.** If you disagree with a suggestion, say so and explain why.
- **Be pragmatic.** Perfect is the enemy of shipped.

Good luck — and have fun with it.
