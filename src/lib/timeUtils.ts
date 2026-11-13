/**
 * Date and timezone helper utilities for Language Proficiency Center (LPC)
 * All institutional class schedules and session dates operate in Asia/Dhaka (GMT+6).
 * Data timestamps are generated and stored in UTC ISO format.
 */

export const INSTITUTION_TIMEZONE = 'Asia/Dhaka';

export function getDhakaDateString(date: Date = new Date()): string {
  // Returns YYYY-MM-DD in Asia/Dhaka timezone
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: INSTITUTION_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function formatDhakaDateTime(isoString: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: INSTITUTION_TIMEZONE,
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d) + ' BST';
  } catch {
    return isoString;
  }
}

export function formatDhakaTimeOnly(time24: string): string {
  // Converts "10:00" to "10:00 AM BST"
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mFmt = m.toString().padStart(2, '0');
  return `${h12}:${mFmt} ${period}`;
}

export function isSessionToday(sessionDate: string): boolean {
  const todayDhaka = getDhakaDateString();
  return sessionDate === todayDhaka;
}

