'use client';

import { bakery, DAYS, formatTime, type Day } from '../content/bakery';
import { allBakes, bakeDaysLabel, type Bake } from '../content/bakes';
import { bakeAnchor } from '../lib/paths';
import { ovenSchedule, ovenToday, type BatchState, type OvenBatch, type OvenToday } from '../lib/oven';
import { BakeArt } from './bake-art';
import { Icon } from './icons';
import { SiteLink } from './site-link';
import { useBakeryClock } from './use-bakery-clock';

const STATE_LABEL: Record<BatchState, string> = { 'just-out': 'Just out!', out: 'Out', next: 'Next batch', later: '' };

const list = (bakes: Bake[]) => {
  const names = bakes.map(bake => bake.name.toLowerCase());
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0];
};

/** One live sentence for the board. Only ever rendered in the browser. */
function status(board: OvenToday, today: Day): string {
  switch (board.phase) {
    case 'before-opening':
      return `Doors open at ${formatTime(board.opens!)} — the first batch is out at ${formatTime(board.batches[0]?.time ?? board.opens!)}.`;
    case 'baking':
      return board.justOut.length
        ? `Just out: ${list(board.justOut)}. Next batch at ${formatTime(board.next!)}.`
        : `Next batch at ${formatTime(board.next!)}.`;
    case 'after-last-batch':
      return board.justOut.length
        ? `Just out: ${list(board.justOut)}. That’s the last batch today — what’s left is on the racks.`
        : 'That’s the last batch today — what’s left is on the racks until we close.';
    case 'closed': {
      if (!board.opens) return 'The ovens are cold for now.';
      const tomorrow = DAYS[(DAYS.indexOf(today) + 1) % 7];
      const when = board.day === tomorrow ? 'tomorrow' : board.day;
      return `The ovens are resting. We’re back ${when} from ${formatTime(board.opens)} — here’s what’s baking.`;
    }
  }
}

function Batch({ batch, state, live, today }: { batch: OvenBatch; state?: BatchState; live: boolean; today: boolean }) {
  return (
    <li className="batch grid w-[min(80vw,17rem)] flex-none snap-start content-start gap-2 sm:w-auto" data-state={state}>
      <div className="flex items-center gap-2.5">
        <span className="batch__dot size-2.5 flex-none rounded-full bg-wheat" aria-hidden="true" />
        <h3 className="batch__time font-display text-[1.45rem] leading-none font-semibold">
          <time dateTime={batch.time}>{formatTime(batch.time)}</time>
        </h3>
        {state && state !== 'later' ? <span className={`batch-label ml-auto ${state === 'just-out' ? 'text-accent' : state === 'next' ? 'text-wheat-ink' : 'text-muted'}`}>{STATE_LABEL[state]}</span> : null}
      </div>
      <ul className={`batch__card card grid gap-1 rounded-card p-2.5 shadow-card ${state === 'out' ? 'opacity-70' : ''}`}>
        {batch.bakes.map(bake => {
          const days = live ? '' : bakeDaysLabel(bake);
          // Sold out is an owner flag for today only, so another day's board doesn't show it.
          const soldOut = bake.soldOut && today;
          return (
            <li key={bake.id}>
              <SiteLink href={bakeAnchor(bake.id)} className="group flex items-center gap-2.5 rounded-[10px] p-1 no-underline hover:bg-surface-2">
                <BakeArt art={bake.art} color={bake.color} size={34} />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className={`block text-[.95rem] font-semibold group-hover:text-accent ${soldOut ? 'text-muted line-through decoration-1' : ''}`}>{bake.name}</span>
                  {days ? <span className="block text-[.78rem] text-muted">{days}</span> : null}
                </span>
                {soldOut ? <span className="sticker sticker-soldout flex-none">Sold out</span> : null}
              </SiteLink>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

/**
 * The home page "Out of the oven" board. The static HTML lists every bake by oven time under a
 * neutral heading. In the browser, with the bakery's time zone set, it narrows to today's bakes and
 * marks what is just out and what is next, refreshed every minute. The build never bakes in a time.
 */
export function OvenBoard() {
  const now = useBakeryClock();
  const board = now ? ovenToday(allBakes, bakery.hours, now.day, now.minutes) : null;
  const batches: { batch: OvenBatch; state?: BatchState }[] = board
    ? board.batches.map(batch => ({ batch, state: batch.state }))
    : ovenSchedule(allBakes).map(batch => ({ batch }));

  const heading = !board ? 'Oven times'
    : board.isToday ? 'Out of the oven today'
    : `${board.day}’s oven times`;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <p className="eyebrow">Out of the oven</p>
          <h2 id="oven-title" className="mt-2 text-[clamp(2rem,4.4vw,3.1rem)]">{heading}</h2>
          <p className="mt-3 flex max-w-(--measure) items-start gap-2 text-[clamp(1.02rem,1.5vw,1.15rem)] text-muted" role="status" aria-live="polite">
            <Icon name="flame" width={20} height={20} className="mt-0.5 flex-none text-accent" />
            <span>
              {board && now ? status(board, now.day)
                : 'We bake in small batches from opening. Here’s when each one usually comes out — when something sells out, it’s gone until the next bake.'}
            </span>
          </p>
        </div>
        <SiteLink href="/bakes/" className="text-link">Everything we bake</SiteLink>
      </div>
      {batches.length ? (
        <ol className="scrollbar-none -mx-(--gutter) flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-(--gutter) px-(--gutter) pb-2 sm:mx-0 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(15.5rem,1fr))] sm:gap-x-5 sm:gap-y-6 sm:overflow-visible sm:px-0">
          {batches.map(({ batch, state }) => <Batch key={batch.time} batch={batch} state={state} live={!!board} today={!board || board.isToday} />)}
        </ol>
      ) : (
        <p className="rounded-ui border-[1.5px] border-dashed border-line-strong p-5 text-muted">No bakes are scheduled. Check back soon.</p>
      )}
    </div>
  );
}
