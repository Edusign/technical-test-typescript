/**
 * Attendance business logic.
 *
 * Service functions that operate on the store and return
 * ServiceResult objects. Routes call these and translate results
 * into HTTP responses.
 */

import { Session, CheckIn, AttendanceRecord, ServiceResult } from '../types';
import { ATTENDANCE_CONFIG } from '../config';
import { getSession, getStudentCheckIn, addCheckIn } from '../db/store';

/**
 * Calculate attendance status for a single student in a session.
 * Used when closing a session to generate the final report.
 */
export async function calculateStatus(session: Session, studentId: number): Promise<AttendanceRecord> {
  const student = session.enrolledStudents.find(s => s.id === studentId)!;
  const checkIn = await getStudentCheckIn(session.id, studentId);

  if (!checkIn) {
    return { studentId, studentName: student.name, status: 'absent', checkedInAt: null };
  }

  const minutesLate = (checkIn.timestamp.getTime() - session.startTime.getTime()) / (1000 * 60);

  let status: 'present' | 'late' | 'absent';
  if (minutesLate <= ATTENDANCE_CONFIG.LATE_AFTER_MINUTES) {
    status = 'present';
  } else if (minutesLate <= ATTENDANCE_CONFIG.ABSENT_AFTER_MINUTES) {
    status = 'late';
  } else {
    status = 'absent';
  }

  return { studentId, studentName: student.name, status, checkedInAt: checkIn.timestamp };
}

/**
 * Process a student check-in for a session.
 * Validates enrollment, session status, and duplicate check-ins.
 */
export async function processCheckIn(sessionId: number, studentId: number): Promise<ServiceResult> {
  const session = await getSession(sessionId);
  if (!session) {
    return { success: false, error: 'Session not found', statusCode: 404 };
  }

  if (session.status === 'closed') {
    return { success: false, error: 'Session is closed', statusCode: 400 };
  }

  const isEnrolled = session.enrolledStudents.some(s => s.id === studentId);
  if (!isEnrolled) {
    return { success: false, error: 'Student is not enrolled in this session', statusCode: 403 };
  }

  const alreadyCheckedIn = await getStudentCheckIn(sessionId, studentId);
  if (alreadyCheckedIn) {
    return { success: false, error: 'Student already checked in', statusCode: 409 };
  }

  const now = new Date();
  const checkIn: CheckIn = { sessionId, studentId, timestamp: now };
  await addCheckIn(checkIn);

  const minutesLate = (now.getTime() - session.startTime.getTime()) / (1000 * 60);

  let status: string;
  if (minutesLate <= ATTENDANCE_CONFIG.LATE_AFTER_MINUTES) {
    status = 'present';
  } else if (minutesLate <= ATTENDANCE_CONFIG.ABSENT_AFTER_MINUTES) {
    status = 'late';
  } else {
    status = 'absent';
  }

  const student = session.enrolledStudents.find(s => s.id === studentId);

  return {
    success: true,
    data: {
      sessionId,
      studentId,
      status,
      checkedInAt: now.toISOString(),
      student,
    },
  };
}

/**
 * Override a student's attendance status.
 * Only the session's teacher is authorized to perform overrides.
 */
export async function overrideStatus(
  sessionId: number,
  studentId: number,
  teacherId: number,
  newStatus: string,
): Promise<ServiceResult> {
  const session = await getSession(sessionId);
  if (!session) {
    return { success: false, error: 'Session not found', statusCode: 404 };
  }

  if (session.teacherId !== teacherId) {
    return { success: false, error: 'Only the session teacher can override attendance', statusCode: 403 };
  }

  const validStatuses = ['present', 'late', 'absent'];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, error: 'Invalid status. Must be: present, late, or absent', statusCode: 400 };
  }

  const student = session.enrolledStudents.find(s => s.id === studentId);
  if (!student) {
    return { success: false, error: 'Student not found in this session', statusCode: 404 };
  }

  return {
    success: true,
    data: {
      sessionId,
      studentId,
      newStatus,
      overriddenBy: teacherId,
    },
  };
}
