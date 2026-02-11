/**
 * Data access layer for sessions and check-ins.
 *
 * Wraps Knex queries and maps between the database schema (snake_case)
 * and the application types (camelCase). The DB connection is injected
 * via setDb() — call this once at startup or in test setup.
 */

import { Knex } from 'knex';
import { Session, CheckIn } from '../types';

let db: Knex;

export function setDb(knexInstance: Knex): void {
  db = knexInstance;
}

export function getDb(): Knex {
  return db;
}

// --- Data access helpers ---

export async function getSession(id: number): Promise<Session | undefined> {
  const row = await db('sessions').where({ id }).first();
  if (!row) return undefined;

  const students = await db('enrolled_students').where({ session_id: id });

  return {
    id: row.id,
    courseId: row.course_id,
    courseName: row.course_name,
    teacherId: row.teacher_id,
    startTime: new Date(row.start_time),
    endTime: new Date(row.end_time),
    status: row.status,
    enrolledStudents: students.map((s: any) => ({
      id: s.student_id,
      name: s.name,
      email: s.email,
    })),
  };
}

export async function saveSession(session: Session): Promise<Session> {
  if (!session.id) {
    // New session — INSERT and get auto-generated ID
    const [id] = await db('sessions').insert({
      course_id: session.courseId,
      course_name: session.courseName,
      teacher_id: session.teacherId,
      start_time: session.startTime.toISOString(),
      end_time: session.endTime.toISOString(),
      status: session.status,
    });

    session.id = id;

    if (session.enrolledStudents.length > 0) {
      await db('enrolled_students').insert(
        session.enrolledStudents.map((s) => ({
          session_id: id,
          student_id: s.id,
          name: s.name,
          email: s.email,
        }))
      );
    }
  } else {
    // Existing session — UPDATE
    await db('sessions').where({ id: session.id }).update({
      course_id: session.courseId,
      course_name: session.courseName,
      teacher_id: session.teacherId,
      start_time: session.startTime.toISOString(),
      end_time: session.endTime.toISOString(),
      status: session.status,
    });

    await db('enrolled_students').where({ session_id: session.id }).delete();
    if (session.enrolledStudents.length > 0) {
      await db('enrolled_students').insert(
        session.enrolledStudents.map((s) => ({
          session_id: session.id,
          student_id: s.id,
          name: s.name,
          email: s.email,
        }))
      );
    }
  }

  return session;
}

export async function getAllSessions(): Promise<Session[]> {
  const rows = await db('sessions').select('*');
  const sessions: Session[] = [];

  for (const row of rows) {
    const students = await db('enrolled_students').where({ session_id: row.id });
    sessions.push({
      id: row.id,
      courseId: row.course_id,
      courseName: row.course_name,
      teacherId: row.teacher_id,
      startTime: new Date(row.start_time),
      endTime: new Date(row.end_time),
      status: row.status,
      enrolledStudents: students.map((s: any) => ({
        id: s.student_id,
        name: s.name,
        email: s.email,
      })),
    });
  }

  return sessions;
}

export async function getCheckInsForSession(sessionId: number): Promise<CheckIn[]> {
  const rows = await db('check_ins').where({ session_id: sessionId });
  return rows.map((r: any) => ({
    sessionId: r.session_id,
    studentId: r.student_id,
    timestamp: new Date(r.timestamp),
  }));
}

export async function getStudentCheckIn(
  sessionId: number,
  studentId: number,
): Promise<CheckIn | undefined> {
  const row = await db('check_ins')
    .where({ student_id: studentId })
    .first();

  if (!row) return undefined;

  return {
    sessionId: row.session_id,
    studentId: row.student_id,
    timestamp: new Date(row.timestamp),
  };
}

export async function addCheckIn(checkIn: CheckIn): Promise<void> {
  await db('check_ins').insert({
    session_id: checkIn.sessionId,
    student_id: checkIn.studentId,
    timestamp: checkIn.timestamp.toISOString(),
  });
}
