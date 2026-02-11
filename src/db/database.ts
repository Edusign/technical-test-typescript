/**
 * Database configuration and schema management.
 *
 * Uses Knex with SQLite for a lightweight, file-based (or in-memory)
 * database that requires no external server.
 */

import knex, { Knex } from 'knex';

/**
 * Create a Knex instance configured for SQLite.
 * Pass ':memory:' for tests, or a filename for persistent storage.
 */
export function createDb(filename: string = ':memory:'): Knex {
  return knex({
    client: 'sqlite3',
    connection: { filename },
    useNullAsDefault: true,
  });
}

/**
 * Create the database tables.
 *
 * Three tables:
 *   - sessions: attendance sessions opened by teachers
 *   - enrolled_students: students enrolled in each session (junction table)
 *   - check_ins: student check-in records with timestamps
 *
 * Dates are stored as ISO 8601 TEXT (SQLite has no native datetime type).
 */
export async function runMigrations(db: Knex): Promise<void> {
  if (!(await db.schema.hasTable('sessions'))) {
    await db.schema.createTable('sessions', (table) => {
      table.increments('id').primary();
      table.integer('course_id').notNullable();
      table.string('course_name').notNullable();
      table.integer('teacher_id').notNullable();
      table.string('start_time').notNullable();
      table.string('end_time').notNullable();
      table.string('status').defaultTo('active');
    });
  }

  if (!(await db.schema.hasTable('enrolled_students'))) {
    await db.schema.createTable('enrolled_students', (table) => {
      table.integer('session_id').references('id').inTable('sessions');
      table.integer('student_id').notNullable();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.primary(['session_id', 'student_id']);
    });
  }

  if (!(await db.schema.hasTable('check_ins'))) {
    await db.schema.createTable('check_ins', (table) => {
      table.integer('session_id').references('id').inTable('sessions');
      table.integer('student_id').notNullable();
      table.string('timestamp').notNullable();
      table.primary(['session_id', 'student_id']);
    });
  }
}
