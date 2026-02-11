import { initializeApp } from './app';
import { getDb } from './db/store';

const port = 3000;

async function seedDevData(): Promise<void> {
  const db = getDb();
  const count = await db('sessions').count('* as n').first();
  if (count && Number(count.n) > 0) return;

  const now = new Date();
  const sessionStart = new Date(now.getTime() - 30 * 60 * 1000); // 30 min ago
  const sessionEnd = new Date(now.getTime() + 90 * 60 * 1000);   // 90 min from now

  const [s1] = await db('sessions').insert({
    course_id: 10,
    course_name: 'Introduction to Computer Science',
    teacher_id: 501,
    start_time: sessionStart.toISOString(),
    end_time: sessionEnd.toISOString(),
    status: 'active',
  });

  await db('enrolled_students').insert([
    { session_id: s1, student_id: 101, name: 'Alice Martin', email: 'alice@school.edu' },
    { session_id: s1, student_id: 102, name: 'Bob Dupont', email: 'bob@school.edu' },
    { session_id: s1, student_id: 103, name: 'Charlie Durand', email: 'charlie@school.edu' },
    { session_id: s1, student_id: 104, name: 'Diana Moreau', email: 'diana@school.edu' },
  ]);

  await db('check_ins').insert([
    { session_id: s1, student_id: 101, timestamp: new Date(sessionStart.getTime() + 5 * 60 * 1000).toISOString() },
    { session_id: s1, student_id: 102, timestamp: new Date(sessionStart.getTime() + 18 * 60 * 1000).toISOString() },
  ]);

  const [s2] = await db('sessions').insert({
    course_id: 20,
    course_name: 'Advanced Databases',
    teacher_id: 502,
    start_time: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
    end_time: new Date(now.getTime() + 180 * 60 * 1000).toISOString(),
    status: 'active',
  });

  await db('enrolled_students').insert([
    { session_id: s2, student_id: 201, name: 'Eve Laurent', email: 'eve@school.edu' },
    { session_id: s2, student_id: 202, name: 'Frank Bernard', email: 'frank@school.edu' },
    { session_id: s2, student_id: 103, name: 'Charlie Durand', email: 'charlie@school.edu' },
  ]);

  console.log('Dev data seeded: 2 sessions, 7 enrollments, 2 check-ins');
}

initializeApp('dev.sqlite3').then(async (app) => {
  await seedDevData();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
