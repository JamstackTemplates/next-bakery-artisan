'use client';

import { useEffect, useState } from 'react';
import type { Day } from '../content/bakery';
import { localNow } from '../lib/local-time';
import { site } from '../lib/site';

/**
 * The bakery's local weekday and minute, refreshed every minute — or null on the server, before
 * hydration, and when no time zone is configured. Components show neutral text while it is null,
 * so the static HTML never claims what is open or out of the oven.
 */
export function useBakeryClock(): { day: Day; minutes: number } | null {
  const [now, setNow] = useState<{ day: Day; minutes: number } | null>(null);
  useEffect(() => {
    if (!site.timeZone) return;
    const update = () => setNow(localNow(site.timeZone));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}
