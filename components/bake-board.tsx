'use client';

import { useState } from 'react';
import { formatTime } from '../content/bakery';
import { BADGES, bakeDaysLabel, bakes, DIETS, formatPrice, type Bake } from '../content/bakes';
import { DIET_FILTERS, matchesAll, visibleCounts, type DietFilter } from '../lib/bake-filter';
import { BakeArt } from './bake-art';
import { Icon } from './icons';

const chipSmall = 'chip min-h-[2.1rem] py-0.5 text-[.88rem]';

function Price({ bake }: { bake: Bake }) {
  const base = `font-display font-semibold whitespace-nowrap text-accent ${bake.soldOut ? 'opacity-60' : ''}`;
  if (typeof bake.price === 'number') return <span className={`${base} text-[1.15rem]`}>{formatPrice(bake.price)}</span>;
  return (
    <span className={`${base} grid justify-items-end gap-px text-[1rem]`}>
      {bake.price.map(size => (
        <span key={size.label}><span className="font-sans text-[.78rem] font-medium text-muted">{size.label}</span> {formatPrice(size.amount)}</span>
      ))}
    </span>
  );
}

function Item({ bake }: { bake: Bake }) {
  const days = bakeDaysLabel(bake);
  return (
    <li id={bake.id} data-sold-out={bake.soldOut ? 'true' : undefined}
      className="bake-item card flex scroll-mt-32 items-start gap-3 p-3.5 transition hover:border-line-strong hover:shadow-card sm:gap-4 sm:px-[1.1rem] sm:py-4">
      <BakeArt art={bake.art} color={bake.color} size={62} className="max-sm:size-[50px]!" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className={`text-[1.2rem] leading-tight ${bake.soldOut ? 'opacity-60' : ''}`}>{bake.name}</h3>
          <span className="min-w-4 flex-1 -translate-y-1 border-b-2 border-dotted border-line-strong" aria-hidden="true" />
          <Price bake={bake} />
        </div>
        <p className="mt-1 text-[.95rem] leading-normal text-muted">{bake.description}</p>
        <p className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {bake.soldOut ? <span className="sticker sticker-soldout">Sold out today</span> : null}
          {bake.badge && !(bake.badge === 'weekend' && days) ? <span className={`sticker sticker-${bake.badge}`}>{BADGES[bake.badge]}</span> : null}
          {days ? <span className="sticker sticker-weekend">{days}</span> : null}
          <span className="mr-1 inline-flex items-center gap-1 text-[.82rem] font-semibold text-muted">
            <Icon name="clock" width={14} height={14} />
            <span className="sr-only">Out of the oven at </span>{bake.ovenTimes.map(formatTime).join(' · ')}
          </span>
          {bake.diet?.map(diet => (
            <abbr key={diet} title={DIETS[diet].label}
              className={`inline-grid h-6 min-w-7 cursor-help place-items-center rounded-[6px] border-[1.5px] px-1.5 text-[.7rem] font-extrabold tracking-wide ${
                diet === 'vegan' ? 'border-sage/50 bg-sage-soft text-sage' : 'border-line-strong text-muted'} ${diet === 'contains-nuts' ? 'border-dashed' : ''}`}>
              {DIETS[diet].short}
            </abbr>
          ))}
        </p>
      </div>
    </li>
  );
}

/**
 * Every bake by section with section shortcuts and dietary filters. The complete list is in the
 * static HTML; filtering is a progressive enhancement that only hides non-matching bakes.
 */
export function BakeBoard() {
  const [filters, setFilters] = useState<DietFilter[]>([]);
  const counts = visibleCounts(bakes.sections, filters);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  const toggle = (id: DietFilter) =>
    setFilters(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);

  return (
    <div>
      <div className="sticky top-(--header-h) z-20 mb-4 grid gap-2.5 border-b border-line bg-bg/90 py-3.5 backdrop-blur-md print:hidden">
        <nav className="scrollbar-none flex gap-2 overflow-x-auto p-0.5" aria-label="Bake sections">
          {bakes.sections.map(section => (
            <a key={section.id} href={`#${section.id}`} className={chipSmall}>
              {section.title}
              {filters.length ? (
                <span className="min-w-[1.4rem] rounded-full bg-wheat-soft px-1.5 text-center text-[.78rem] text-wheat-ink">{counts[section.id]}</span>
              ) : null}
            </a>
          ))}
        </nav>
        <div className="scrollbar-none flex gap-2 overflow-x-auto p-0.5" role="group" aria-label="Dietary filters">
          <span className="inline-flex items-center gap-1.5 pr-1 text-[.85rem] font-bold whitespace-nowrap text-muted"><Icon name="filter" width={16} height={16} />Show only</span>
          {DIET_FILTERS.map(filter => (
            <button key={filter.id} type="button" className={chipSmall} aria-pressed={filters.includes(filter.id)} onClick={() => toggle(filter.id)}>
              {filter.label}
            </button>
          ))}
          {filters.length ? <button type="button" className={`${chipSmall} border-dashed text-muted`} onClick={() => setFilters([])}>Clear</button> : null}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {filters.length ? `${total} bakes match.` : ''}
        </p>
      </div>

      {bakes.sections.map(section => (
        <section key={section.id} id={section.id} className="scroll-mt-36 pt-8 pb-4" aria-labelledby={`${section.id}-title`}>
          <header className="mb-5 grid gap-1.5">
            <h2 id={`${section.id}-title`} className="flex items-center gap-3 text-[clamp(1.9rem,3.6vw,2.6rem)]">
              <Icon name="wheat" width={26} height={26} className="flex-none text-wheat" />
              {section.title}
            </h2>
            <p className="text-muted">{section.description}</p>
          </header>
          {counts[section.id] ? (
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,21rem),1fr))] gap-3.5">
              {section.bakes.filter(bake => matchesAll(bake, filters)).map(bake => <Item key={bake.id} bake={bake} />)}
            </ul>
          ) : (
            <p className="rounded-ui border-[1.5px] border-dashed border-line-strong p-5 text-muted">Nothing here matches those filters today — ask at the counter, there’s often something.</p>
          )}
        </section>
      ))}
    </div>
  );
}
