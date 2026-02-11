/**
 * Test database lifecycle management.
 *
 * Creates an in-memory SQLite database for each test suite,
 * runs migrations, and tears down after tests complete.
 */

import { Knex } from 'knex';
import { createDb, runMigrations } from '../../src/db/database';
import { setDb } from '../../src/db/store';

let testDb: Knex;

export async function setupTestDb(): Promise<void> {
  testDb = createDb(':memory:');
  await runMigrations(testDb);
  setDb(testDb);
}

export async function teardownTestDb(): Promise<void> {
  if (testDb) {
    await testDb.destroy();
  }
}
