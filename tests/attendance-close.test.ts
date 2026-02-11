import request from 'supertest';
import app from '../src/app';
import { Session } from '../src/types';
import { setupTestDb, teardownTestDb } from './helpers/setup';
import { seedTestData, resetStore } from './helpers/seed';
import { getDb } from '../src/db/store';

describe('POST /attendance/sessions/:id/close', () => {
  let session: Session;

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    session = await seedTestData();
  });

  afterEach(async () => {
    await resetStore();
  });

  it('should return 404 for a non-existent session', async () => {
    const res = await request(app)
      .post('/attendance/sessions/999/close')
      .send({ teacherId: 501 });

    expect(res.status).toBe(404);
  });

  it('should return 400 if the session is already closed', async () => {
    // Close the session directly in DB
    await getDb()('sessions').where({ id: session.id }).update({ status: 'closed' });

    const res = await request(app)
      .post(`/attendance/sessions/${session.id}/close`)
      .send({ teacherId: 501 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already closed/i);
  });

  it('should mark on-time students as present (checked in within 15 min)', async () => {
    const res = await request(app)
      .post(`/attendance/sessions/${session.id}/close`)
      .send({ teacherId: 501 });

    expect(res.status).toBe(200);

    // Student 101 checked in at +5 min → present
    const alice = res.body.records.find((r: any) => r.studentId === 101);
    expect(alice).toBeDefined();
    expect(alice.status).toBe('present');
  });

  it('should mark students who checked in after 15 min as late', async () => {
    const res = await request(app)
      .post(`/attendance/sessions/${session.id}/close`)
      .send({ teacherId: 501 });

    expect(res.status).toBe(200);

    // Student 102 checked in at +18 min → late
    const bob = res.body.records.find((r: any) => r.studentId === 102);
    expect(bob).toBeDefined();
    expect(bob.status).toBe('late');
  });

  it('should mark students who checked in at 30+ min or never as absent', async () => {
    const res = await request(app)
      .post(`/attendance/sessions/${session.id}/close`)
      .send({ teacherId: 501 });

    expect(res.status).toBe(200);

    // Student 103 checked in at +35 min → absent (>=30 min)
    const charlie = res.body.records.find((r: any) => r.studentId === 103);
    expect(charlie).toBeDefined();
    expect(charlie.status).toBe('absent');

    // Student 104 never checked in → absent
    const diana = res.body.records.find((r: any) => r.studentId === 104);
    expect(diana).toBeDefined();
    expect(diana.status).toBe('absent');
    expect(diana.checkedInAt).toBeNull();
  });

  it('should prevent further check-ins after closing', async () => {
    // Close the session
    await request(app)
      .post(`/attendance/sessions/${session.id}/close`)
      .send({ teacherId: 501 });

    // Try to check in after closing
    const res = await request(app)
      .post('/attendance/check-in')
      .send({ sessionId: session.id, studentId: 104 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/closed/i);
  });

  it('should return a complete summary with counts', async () => {
    const res = await request(app)
      .post(`/attendance/sessions/${session.id}/close`)
      .send({ teacherId: 501 });

    expect(res.status).toBe(200);
    expect(res.body.sessionId).toBe(session.id);
    expect(res.body.status).toBe('closed');

    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.total).toBe(4);
    expect(res.body.summary.present).toBe(1);
    expect(res.body.summary.late).toBe(1);
    expect(res.body.summary.absent).toBe(2);

    expect(res.body.records).toHaveLength(4);
  });
});
