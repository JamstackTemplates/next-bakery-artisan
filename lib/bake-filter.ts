import type { Bake, BakeSection, Diet } from '../content/bakes';

/** Filters offered on the bakes page. Each one narrows the list; several together must all match. */
export type DietFilter = 'vegan' | 'vegetarian' | 'nut-free';

export const DIET_FILTERS: { id: DietFilter; label: string }[] = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'nut-free', label: 'No nuts' },
];

function has(bake: Bake, diet: Diet): boolean {
  return bake.diet?.includes(diet) ?? false;
}

/** Vegan bakes count as vegetarian even when not tagged twice. "No nuts" hides anything tagged contains-nuts. */
export function matchesFilter(bake: Bake, filter: DietFilter): boolean {
  switch (filter) {
    case 'vegan': return has(bake, 'vegan');
    case 'vegetarian': return has(bake, 'vegetarian') || has(bake, 'vegan');
    case 'nut-free': return !has(bake, 'contains-nuts');
  }
}

export function matchesAll(bake: Bake, filters: readonly DietFilter[]): boolean {
  return filters.every(filter => matchesFilter(bake, filter));
}

/** Count of visible bakes per section for the active filters. */
export function visibleCounts(sections: readonly BakeSection[], filters: readonly DietFilter[]): Record<string, number> {
  return Object.fromEntries(sections.map(section => [section.id, section.bakes.filter(bake => matchesAll(bake, filters)).length]));
}
