/**
 * Shared type definitions for the attendance system.
 *
 * These interfaces define the data model used across routes,
 * services, and the in-memory store.
 */

export interface EnrolledStudent {
  id: number;
  name: string;
  email: string;
}

export interface Session {
  id: number;
  courseId: number;
  courseName: string;
  teacherId: number;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'closed';
  enrolledStudents: EnrolledStudent[];
}

export interface CheckIn {
  sessionId: number;
  studentId: number;
  timestamp: Date;
}

export interface AttendanceRecord {
  studentId: number;
  studentName: string;
  status: 'present' | 'late' | 'absent';
  checkedInAt: Date | null;
}

/**
 * Standard result type returned by service functions.
 *
 * Routes should check `success` before using `data`.
 * When `success` is false, `error` contains a human-readable message
 * and `statusCode` indicates the appropriate HTTP status.
 */
export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}
