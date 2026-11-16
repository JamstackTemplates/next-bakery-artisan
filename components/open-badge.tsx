'use client';

import { formatTime, openDaysLabel, openState, type Day, type OpenState } from '../content/bakery';
import { useBakeryClock } from './use-bakery-clock';

function describe(state: OpenState, today: Day): string {
  if (state.open) return `Open now · until ${formatTime(state.closes)}`;
  if (!state.next) return 'Closed';
  const when = state.next.day === today ? 'today' : state.next.day;
  return `Closed · opens ${when} at ${formatTime(state.next.opens)}`;
}

// Neutral label for the static HTML: true whatever the time, so it never claims open or closed.
const neutral = openDaysLabel() === 'Every day' ? 'Open every day' : `Open ${openDaysLabel()}`;

/**
 * "Open now" pill. The static HTML shows a neutral label; the browser fills in the live state
 * after hydration (so the build never bakes in the time it ran) and refreshes it each minute.
 * Without a configured time zone it never claims open or closed: the neutral label stays.
 */
export function OpenBadge({ fallback = neutral }: { fallback?: string }) {
  const now = useBakeryClock();
  const state = now ? openState(now.day, now.minutes) : null;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface py-1.5 pr-3.5 pl-3 text-[.9rem] font-bold shadow-card"
      data-open={state ? String(state.open) : undefined}>
      <span className="open-badge__dot" aria-hidden="true" />
      <span>{state && now ? describe(state, now.day) : fallback}</span>
    </span>
  );
}
