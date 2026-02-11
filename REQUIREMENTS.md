# Live Attendance Check-in — Product Requirements

## Feature Summary

Teachers open attendance sessions for their classes. Students check in by confirming their presence during the session window. The system automatically tracks attendance status (present, late, absent) based on check-in timing.

This feature replaces the manual paper sign-in sheets currently used by most schools.

---

## User Stories

### Teacher opens a session

As a teacher, I want to open an attendance session for my class so that students can check in digitally.

- The session is tied to a specific course and has a defined start time and end time.
- Only the teacher assigned to the course can open a session for it.
- The session starts with status `active`.

### Student checks in

As a student, I want to check in to an active session to record my attendance.

- A student can only check in to a session they are enrolled in.
- A student cannot check in to a session that has been closed.
- **A student cannot be checked into two active sessions simultaneously.**

### Teacher closes session and gets report

As a teacher, I want to close an attendance session and receive a summary report of all students' attendance status.

- **Only the session's teacher can close the session.**
- When closed, the system calculates final attendance for every enrolled student.
- The response includes a summary with counts of present, late, and absent students, plus individual records.

### Teacher overrides a student's status

As a teacher, I want to override a student's attendance status in case of errors or special circumstances.

- **Only the session's teacher can override statuses in their session.**
- The override replaces the automatically calculated status.

---

## Business Rules

### Attendance status calculation

Status is determined by the time elapsed between the session start time and the student's check-in timestamp:

| Condition | Status |
|---|---|
| Check-in within **15 minutes** of session start | `present` |
| Check-in between **15 and 30 minutes** after session start | `late` |
| Check-in **30 minutes or more** after session start, or no check-in | `absent` |

> **Note**: The 30-minute boundary is inclusive — a student who checks in at exactly 30 minutes is marked `absent`.

### Session lifecycle

1. Teacher creates session → status is `active`
2. Students check in during the session
3. Teacher closes session → status becomes `closed`, final attendance is calculated
4. No further check-ins are accepted after closing

### Constraints

- A student cannot be checked into two active sessions at the same time.
- Only the session's teacher can close the session or override attendance statuses.

---

## Data Handling

- **No PII (names, emails) in application logs.** Student data should only appear in API responses to authenticated requests.
- Sensitive data (API keys, webhook URLs) must not be hardcoded in source code — use environment variables.

---

## Session Close Response Format

When a teacher closes a session, the API should return:

```json
{
  "sessionId": 1,
  "status": "closed",
  "summary": {
    "total": 4,
    "present": 1,
    "late": 1,
    "absent": 2
  },
  "records": [
    { "studentId": 101, "studentName": "Alice Martin", "status": "present", "checkedInAt": "2025-01-15T09:05:00.000Z" },
    { "studentId": 102, "studentName": "Bob Dupont", "status": "late", "checkedInAt": "2025-01-15T09:18:00.000Z" },
    { "studentId": 103, "studentName": "Charlie Durand", "status": "absent", "checkedInAt": null },
    { "studentId": 104, "studentName": "Diana Moreau", "status": "absent", "checkedInAt": null }
  ]
}
```
