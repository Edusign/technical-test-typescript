/**
 * Application configuration.
 *
 * Attendance thresholds determine how check-in timing maps to status.
 * These values are used by the attendance service to classify students.
 */
export const ATTENDANCE_CONFIG = {
  /** Minutes after session start before a student is marked late */
  LATE_AFTER_MINUTES: 20,
  /** Minutes after session start before a student is marked absent */
  ABSENT_AFTER_MINUTES: 30,
};

/** Webhook URL for sending attendance notifications to external services */
export const NOTIFICATION_WEBHOOK_URL = process.env.NOTIFICATION_WEBHOOK_URL || '';
