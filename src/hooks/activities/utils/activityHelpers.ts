import { Activity } from '@/domain/activity.model';

// ─── Interpolation helper ───────────────────────────────────────────────────

function interpolate(
  template: string,
  params: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    String(params[key] ?? `{${key}}`)
  );
}

// ─── Activity message regex patterns (match cleaned API-provided EN strings) ─

const STARTED_RE = /^(.+) has started reading "(.+)" by (.+?)\.?$/;
const FINISHED_RE = /^(.+) has finished reading "(.+)" by (.+?)\.?$/;
const RATED_RE =
  /^(.+) has given a rating of ([0-9.]+) stars to "(.+)" by (.+?)\.?$/;
const PROGRESS_PERCENT_RE =
  /^(.+) has made progress \((\d+)%\) on "(.+)" by (.+?)\.?$/;
const PROGRESS_PAGES_RE =
  /^(.+) has made progress \((\d+) pages?\) on "(.+)" by (.+?)\.?$/;
const WANT_TO_READ_RE =
  /^(.+) has added "(.+)" by (.+?) to their want to read list\.?$/;

/**
 * Re-constructs an activity message using translated templates.
 * Falls back to the original string if no pattern matches.
 */
export function translateActivityMessage(
  message: string,
  t: (id: string) => string
): string {
  let m: RegExpMatchArray | null;

  if ((m = message.match(STARTED_RE))) {
    return interpolate(t('activity.message.started'), {
      username: m[1],
      title: m[2],
      author: m[3],
    });
  }
  if ((m = message.match(FINISHED_RE))) {
    return interpolate(t('activity.message.finished'), {
      username: m[1],
      title: m[2],
      author: m[3],
    });
  }
  if ((m = message.match(RATED_RE))) {
    return interpolate(t('activity.message.rated'), {
      username: m[1],
      rating: m[2],
      title: m[3],
      author: m[4],
    });
  }
  if ((m = message.match(PROGRESS_PERCENT_RE))) {
    return interpolate(t('activity.message.progress.percent'), {
      username: m[1],
      percent: m[2],
      title: m[3],
      author: m[4],
    });
  }
  if ((m = message.match(PROGRESS_PAGES_RE))) {
    return interpolate(t('activity.message.progress.pages'), {
      username: m[1],
      pages: m[2],
      title: m[3],
      author: m[4],
    });
  }
  if ((m = message.match(WANT_TO_READ_RE))) {
    return interpolate(t('activity.message.wantToRead'), {
      username: m[1],
      title: m[2],
      author: m[3],
    });
  }

  return message; // fallback: return unchanged
}

// ─── Locale-aware relative date ─────────────────────────────────────────────

/**
 * Formats a date as a relative time string using Intl.RelativeTimeFormat.
 * Produces e.g. "2 hours ago" (en), "hace 2 horas" (es), "vor 2 Stunden" (de).
 */
export function formatRelativeDateI18n(
  date: Date | string,
  locale: string
): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSeconds < 60) return rtf.format(-diffSeconds, 'second');
  if (diffMinutes < 60) return rtf.format(-diffMinutes, 'minute');
  if (diffHours < 24) return rtf.format(-diffHours, 'hour');
  if (diffDays < 7) return rtf.format(-diffDays, 'day');
  if (diffWeeks < 4) return rtf.format(-diffWeeks, 'week');
  if (diffMonths < 12) return rtf.format(-diffMonths, 'month');
  return rtf.format(-diffYears, 'year');
}

export function sortActivitiesByDate(a: Activity, b: Activity): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

/**
 * Extract bookId from activity message
 * Looks for pattern [bookId] in message
 */
export function extractBookId(message: string): string | null {
  const pattern = /\[(\d+)\]/;
  const match = message.match(pattern);
  return match && match[1] ? match[1] : null;
}

/**
 * Clean activity message by removing [bookId] tag
 */
export function cleanActivityMessage(message: string): string {
  return message.replace(/\[\d+\]\s*/, '');
}

/**
 * Format date to dd/mm/yyyy
 */
export function formatActivityDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format date as relative time (e.g., "hace 2 horas", "hace 3 días")
 */
export function formatRelativeDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return 'hace unos segundos';
  } else if (diffMinutes < 60) {
    return `hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffHours < 24) {
    return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  } else if (diffDays < 7) {
    return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  } else if (diffWeeks < 4) {
    return `hace ${diffWeeks} ${diffWeeks === 1 ? 'semana' : 'semanas'}`;
  } else if (diffMonths < 12) {
    return `hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
  } else {
    return `hace ${diffYears} ${diffYears === 1 ? 'año' : 'años'}`;
  }
}
