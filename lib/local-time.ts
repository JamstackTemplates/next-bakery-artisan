import type { Day } from '../content/bakery';

const WEEK: readonly Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * Current weekday and minutes after midnight in the bakery's own time zone (an IANA name such as
 * America/Los_Angeles), whatever the visitor's device is set to. Only ever called in the browser,
 * so the static build never bakes in the time it ran.
 */
export function localNow(timeZone: string, now = new Date()): { day: Day; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(now);
  const part = (type: string) => parts.find(item => item.type === type)?.value ?? '';
  const day = part('weekday') as Day;
  return { day: WEEK.includes(day) ? day : 'Monday', minutes: Number(part('hour')) * 60 + Number(part('minute')) };
}
