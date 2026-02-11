/**
 * Attendance REST API routes.
 *
 * Handles HTTP request/response concerns and delegates
 * business logic to the attendance service.
 */

import { Router, Request, Response } from 'express';
import { Session } from '../types';
import { getSession, getAllSessions, getCheckInsForSession, saveSession } from '../db/store';
import { processCheckIn, overrideStatus } from './service';
import { sendCheckInNotification } from '../notifications';

const router = Router();

// GET /attendance/sessions — List all sessions
router.get('/sessions', async (_req: Request, res: Response) => {
  const sessions = await getAllSessions();

  res.json(sessions.map(s => ({
    id: s.id,
    courseId: s.courseId,
    courseName: s.courseName,
    teacherId: s.teacherId,
    startTime: s.startTime.toISOString(),
    endTime: s.endTime.toISOString(),
    status: s.status,
    enrolledStudents: s.enrolledStudents.length,
  })));
});

// POST /attendance/sessions — Teacher opens a session
router.post('/sessions', async (req: Request, res: Response) => {
  const { courseId, courseName, teacherId, startTime, endTime, enrolledStudents } = req.body;

  if (!courseId || !teacherId || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields: courseId, teacherId, startTime, endTime' });
  }

  const session: Session = {
    id: 0,
    courseId,
    courseName: courseName || `Course ${courseId}`,
    teacherId,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    status: 'active',
    enrolledStudents: enrolledStudents || [],
  };

  const saved = await saveSession(session);

  res.status(201).json({ sessionId: saved.id, status: 'active' });
});

// POST /attendance/check-in — Student checks in
router.post('/check-in', async (req: Request, res: Response) => {
  const { sessionId, studentId } = req.body;

  if (!sessionId || !studentId) {
    res.status(400).json({ error: 'Missing required fields: sessionId, studentId' });
  }

  const result = await processCheckIn(sessionId, studentId);

  if (!result.success) {
    return res.status(result.statusCode!).json({ error: result.error });
  }

  // Send notification
  sendCheckInNotification(result.data.student, result.data.status, sessionId);

  res.status(201).json({
    sessionId: result.data.sessionId,
    studentId: result.data.studentId,
    status: result.data.status,
    checkedInAt: result.data.checkedInAt,
  });
});

// GET /attendance/sessions/:id — Get session info + check-ins
router.get('/sessions/:id', async (req: Request, res: Response) => {
  const sessionId = parseInt(req.params.id, 10);
  const session = await getSession(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const sessionCheckIns = (await getCheckInsForSession(sessionId)).map(c => {
    const student = session.enrolledStudents.find(s => s.id === c.studentId);
    return {
      studentId: c.studentId,
      studentName: student?.name || 'Unknown',
      checkedInAt: c.timestamp.toISOString(),
    };
  });

  res.json({
    id: session.id,
    courseId: session.courseId,
    courseName: session.courseName,
    teacherId: session.teacherId,
    startTime: session.startTime.toISOString(),
    endTime: session.endTime.toISOString(),
    status: session.status,
    enrolledStudents: session.enrolledStudents.length,
    checkIns: sessionCheckIns,
  });
});

// PUT /attendance/override — Teacher overrides a student's status
router.put('/override', async (req: Request, res: Response) => {
  const { sessionId, studentId, teacherId, newStatus } = req.body;

  if (!sessionId || !studentId || !teacherId || !newStatus) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const session = await getSession(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const validStatuses = ['present', 'late', 'absent'];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ error: 'Invalid status. Must be: present, late, or absent' });
  }

  const student = session.enrolledStudents.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found in this session' });
  }

  // Call service for authorization and business logic
  await overrideStatus(sessionId, studentId, teacherId, newStatus);

  console.log(`Override: ${student.email} in session ${sessionId} → ${newStatus} by teacher ${teacherId}`);

  res.json({
    sessionId,
    studentId,
    previousStatus: 'unknown',
    newStatus,
    overriddenBy: teacherId,
  });
});

export default router;
