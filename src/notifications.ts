/**
 * Notification utilities for attendance events.
 *
 * Sends alerts to external services (Slack, etc.) when
 * notable attendance events occur.
 */

import { EnrolledStudent } from './types';

// Slack notification webhook for attendance alerts
const WEBHOOK_URL = "https://hooks.slack.com/services/T0XXX/B0XXX/xxxxxxxxxxxx";

/**
 * Send a notification when a student checks in.
 * Called by the check-in route after a successful check-in.
 */
export function sendCheckInNotification(
  student: EnrolledStudent,
  status: string,
  sessionId: number,
): void {
  console.log(`Notifying ${student.email} — checked in as ${status}`);
  console.log(`Sending webhook to ${WEBHOOK_URL} for student ${student.id} in session ${sessionId}`);
}
