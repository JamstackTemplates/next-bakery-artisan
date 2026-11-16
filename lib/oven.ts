// "Out of the oven" schedule logic. Pure functions of the bakes, the opening hours and a local
// day/time, so they are unit tested (tests/oven.test.ts) and the browser only supplies the clock.
import type { Bake } from '../content/bakes';
import type { Day, OpeningHours } from '../content/bakery';

const WEEK: readonly Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** How long a batch counts as "Just out" after its oven time. */
export const JUST_OUT_MINUTES = 45;

const minutesOf = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

/** Whether a bake is made on a given weekday. Bakes without `days` are made every day the bakery opens. */
export function bakedOn(bake: Pick<Bake, 'days'>, day: Day): boolean {
  return !bake.days?.length || bake.days.includes(day);
}

export interface OvenBatch {
  /** Local "HH:MM". */
  time: string;
  bakes: Bake[];
}

/**
 * Bakes grouped by oven time, earliest first. With a `day`, only that day's bakes; without one,
 * every bake (the static, day-neutral schedule shown before JavaScript runs).
 */
export function ovenSchedule(bakes: readonly Bake[], day?: Day): OvenBatch[] {
  const byTime = new Map<string, Bake[]>();
  for (const bake of bakes) {
    if (day && !bakedOn(bake, day)) continue;
    for (const time of bake.ovenTimes) byTime.set(time, [...(byTime.get(time) ?? []), bake]);
  }
  return [...byTime].sort(([a], [b]) => minutesOf(a) - minutesOf(b)).map(([time, items]) => ({ time, bakes: items }));
}

/** `out`: came out earlier; `just-out`: within the last 45 minutes; `next`: the next batch with something left; `later`: still to come. */
export type BatchState = 'just-out' | 'out' | 'next' | 'later';

export interface TodayBatch extends OvenBatch {
  state: BatchState;
}

export interface OvenToday {
  /**
   * - `before-opening`: open later today, nothing out yet
   * - `baking`: open, with at least one batch still to come
   * - `after-last-batch`: open, and every batch is out
   * - `closed`: closed all day, or past closing time; the schedule shown is the next opening day's
   */
  phase: 'before-opening' | 'baking' | 'after-last-batch' | 'closed';
  /** The day whose batches are listed: today, or the next opening day when closed. */
  day: Day;
  isToday: boolean;
  /** Opening time of `day`, when it opens. */
  opens?: string;
  batches: TodayBatch[];
  /** Time of the next batch that still has something to sell, if any. */
  next?: string;
  /** Bakes out within the last 45 minutes that aren't sold out. */
  justOut: Bake[];
}

const available = (batch: OvenBatch) => batch.bakes.some(bake => !bake.soldOut);

/** What the oven board says at a given local day and minute. */
export function ovenToday(bakes: readonly Bake[], hours: readonly OpeningHours[], day: Day, minutes: number): OvenToday {
  const today = hours.find(entry => entry.day === day);
  const openToday = Boolean(today?.opens && today.closes);

  if (!openToday || minutes >= minutesOf(today!.closes!)) {
    const start = WEEK.indexOf(day);
    for (let offset = 1; offset <= 7; offset++) {
      const candidate = WEEK[(start + offset) % 7];
      const entry = hours.find(item => item.day === candidate);
      if (!entry?.opens || !entry.closes) continue;
      const batches = ovenSchedule(bakes, candidate).map(batch => ({ ...batch, state: 'later' as const }));
      return { phase: 'closed', day: candidate, isToday: false, opens: entry.opens, batches, justOut: [] };
    }
    return { phase: 'closed', day, isToday: true, batches: [], justOut: [] };
  }

  const opens = today!.opens!;
  let next: string | undefined;
  const batches: TodayBatch[] = ovenSchedule(bakes, day).map(batch => {
    const at = minutesOf(batch.time);
    if (minutes < at) {
      const isNext = !next && available(batch);
      if (isNext) next = batch.time;
      return { ...batch, state: isNext ? 'next' : 'later' };
    }
    return { ...batch, state: minutes - at < JUST_OUT_MINUTES ? 'just-out' : 'out' };
  });
  const justOut = batches.filter(batch => batch.state === 'just-out').flatMap(batch => batch.bakes).filter(bake => !bake.soldOut);
  const phase = minutes < minutesOf(opens) ? 'before-opening' : next ? 'baking' : 'after-last-batch';
  return { phase, day, isToday: true, opens, batches, next, justOut };
}
