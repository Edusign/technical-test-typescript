/**
 * Test data seeding utilities.
 *
 * Seeds the database with a standard test session and check-ins.
 *
 * Session: started 45 minutes ago, ends in 75 minutes, 4 enrolled students.
 * Check-ins:
 *   - Student 101 (Alice): checked in at +5 min  → present
 *   - Student 102 (Bob):   checked in at +18 min → late (per spec: >15 min)
 *   - Student 103 (Charlie): checked in at +35 min → absent (per spec: >=30 min)
 *   - Student 104 (Diana): never checked in       → absent
 */

import { Session } from '../../src/types';
import { getDb } from '../../src/db/store';

export async function seedTestData(): Promise<Session> {
  const db = getDb();

  const sessionStart = new Date(Date.now() - 45 * 60 * 1000); // 45 min ago
  const sessionEnd = new Date(sessionStart.getTime() + 120 * 60 * 1000); // 2 hours

  // Insert session
  const [sessionId] = await db('sessions').insert({
    course_id: 10,
    course_name: 'Introduction to Computer Science',
    teacher_id: 501,
    start_time: sessionStart.toISOString(),
    end_time: sessionEnd.toISOString(),
    status: 'active',
  });

  // Insert enrolled students
  await db('enrolled_students').insert([
    { session_id: sessionId, student_id: 101, name: 'Alice Martin', email: 'alice@school.edu' },
    { session_id: sessionId, student_id: 102, name: 'Bob Dupont', email: 'bob@school.edu' },
    { session_id: sessionId, student_id: 103, name: 'Charlie Durand', email: 'charlie@school.edu' },
    { session_id: sessionId, student_id: 104, name: 'Diana Moreau', email: 'diana@school.edu' },
  ]);

  // Student 101: checked in 5 minutes after start → present
  // Student 102: checked in 18 minutes after start → late (>15 min per spec)
  // Student 103: checked in 35 minutes after start → absent (>=30 min per spec)
  // Student 104: never checked in → absent
  await db('check_ins').insert([
    {
      session_id: sessionId,
      student_id: 101,
      timestamp: new Date(sessionStart.getTime() + 5 * 60 * 1000).toISOString(),
    },
    {
      session_id: sessionId,
      student_id: 102,
      timestamp: new Date(sessionStart.getTime() + 18 * 60 * 1000).toISOString(),
    },
    {
      session_id: sessionId,
      student_id: 103,
      timestamp: new Date(sessionStart.getTime() + 35 * 60 * 1000).toISOString(),
    },
  ]);

  // Return the session object matching the Session interface
  return {
    id: sessionId,
    courseId: 10,
    courseName: 'Introduction to Computer Science',
    teacherId: 501,
    startTime: sessionStart,
    endTime: sessionEnd,
    status: 'active',
    enrolledStudents: [
      { id: 101, name: 'Alice Martin', email: 'alice@school.edu' },
      { id: 102, name: 'Bob Dupont', email: 'bob@school.edu' },
      { id: 103, name: 'Charlie Durand', email: 'charlie@school.edu' },
      { id: 104, name: 'Diana Moreau', email: 'diana@school.edu' },
    ],
  };
}

export async function resetStore(): Promise<void> {
  const db = getDb();
  await db('check_ins').delete();
  await db('enrolled_students').delete();
  await db('sessions').delete();
}
