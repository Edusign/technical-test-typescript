import express from 'express';
import { createDb, runMigrations } from './db/database';
import { setDb } from './db/store';
import attendanceRouter from './attendance/routes';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Attendance routes
app.use('/attendance', attendanceRouter);

/**
 * Initialize the database and return the app.
 * Used by server.ts for production startup.
 * Tests manage their own DB lifecycle via setupTestDb().
 */
export async function initializeApp(dbPath: string = ':memory:'): Promise<typeof app> {
  const db = createDb(dbPath);
  await runMigrations(db);
  setDb(db);
  return app;
}

export default app;
