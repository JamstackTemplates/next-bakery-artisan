// Bakery details. Edit this file to make the website yours.
// Everything here is placeholder content for a fictitious bakery. The sample address is a well-known
// public landmark (Union Square, San Francisco) so the map has something to show; replace it with yours.
// Plain strings only: text is rendered as text, never as HTML.

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS: readonly Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface OpeningHours {
  day: Day;
  /** 24-hour "HH:MM" local time, e.g. "07:00". Omit both to mark the day closed. */
  opens?: string;
  closes?: string;
}

export interface Amenity {
  /** Icon name from components/icons.tsx. */
  icon: 'bag' | 'knife' | 'paw' | 'cup' | 'leaf' | 'tag';
  title: string;
  detail: string;
}

/** One point of "how we bake", shown beside the story on the home page. */
export interface ApproachPoint {
  title: string;
  detail: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface BakeryLink {
  label: string;
  /** Absolute https:// URL. Entries with an empty URL are not rendered. */
  url: string;
}

export interface Bakery {
  name: string;
  /** Short line under the name on the home page. */
  tagline: string;
  /** One or two sentences: the first thing visitors read. */
  introduction: string;
  /** Home page "the bakery" paragraphs: your starter, flour, ovens and people. */
  story: string[];
  /** Three or four short points about how you bake, shown beside the story. */
  approach: ApproachPoint[];
  /** Public contact address. Choose an address you are happy to publish. */
  email: string;
  /** Public phone number as written for people, e.g. "(555) 010-2040". Set to '' to hide it. */
  phone: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    /** ISO 3166-1 alpha-2, e.g. "US". */
    country: string;
    /** Optional landmark or cross streets shown under the address, e.g. "Corner of Post and Stockton". */
    note?: string;
  };
  /** How to find you: transit, parking, landmarks. */
  directions: string[];
  /** Local times in the bakery's time zone, which is set by `timeZone` in site.config.json. */
  hours: OpeningHours[];
  /** Optional one-off notice such as holiday hours. Set to '' to hide it. */
  notice: string;
  amenities: Amenity[];
  faqs: Faq[];
  /** Public profiles. Leave `url` empty to hide an entry. */
  links: BakeryLink[];
}

export const bakery: Bakery = {
  name: 'Acme Bakehouse',
  tagline: 'Sourdough, viennoiserie & celebration cakes',
  introduction:
    'A neighbourhood bakery with a wood-fired oven and a long memory. Bread, pastries and cakes made by hand from first light, in small batches, until they’re gone.',
  story: [
    'Our levain is called Gus. He’s fed twice a day with stone-milled flour from a small family mill up the valley, and every loaf we sell starts with him.',
    'Doughs ferment slowly overnight — up to 36 hours for the country loaf — so the bread tastes of wheat, keeps for days and is kinder to digest. At 4am the oven is lit, and we bake in small batches through the morning so there’s always something warm on the racks.',
  ],
  approach: [
    { title: 'Long, slow fermentation', detail: 'Wild-yeast doughs rest up to 36 hours for flavour, crust and keeping.' },
    { title: 'Stone-milled local flour', detail: 'Heritage wheat and rye from growers we know by name.' },
    { title: 'Small batches, all morning', detail: 'Bakes come out in waves, so the racks are never stale.' },
    { title: 'Butter, eggs and fruit we trust', detail: 'Cultured butter, free-range eggs and fruit from the market.' },
  ],
  email: 'hello@example.com',
  phone: '(555) 010-4370',
  address: {
    street: '333 Post St',
    locality: 'San Francisco',
    region: 'CA',
    postalCode: '94108',
    country: 'US',
    note: 'On Union Square, between Stockton and Powell Streets',
  },
  directions: [
    'Two minutes’ walk from Powell St station (BART and Muni Metro) — head north up Powell Street.',
    'The Powell–Hyde and Powell–Mason cable cars stop at Union Square. Bike racks are on Post Street.',
    'Step-free entrance and level counter; ask and we’ll bring your order to the bench outside.',
  ],
  hours: [
    { day: 'Monday' },
    { day: 'Tuesday', opens: '07:00', closes: '15:00' },
    { day: 'Wednesday', opens: '07:00', closes: '15:00' },
    { day: 'Thursday', opens: '07:00', closes: '15:00' },
    { day: 'Friday', opens: '07:00', closes: '15:00' },
    { day: 'Saturday', opens: '07:00', closes: '16:00' },
    { day: 'Sunday', opens: '07:00', closes: '13:00' },
  ],
  notice: '',
  amenities: [
    { icon: 'knife', title: 'Sliced to order', detail: 'Any loaf, thick or thin — just ask at the counter.' },
    { icon: 'bag', title: 'Bring a bag', detail: 'Bring your own bread bag and we’ll take 25¢ off.' },
    { icon: 'tag', title: 'Day-old loaves', detail: 'Yesterday’s bread at half price, from opening.' },
    { icon: 'cup', title: 'Coffee to go', detail: 'Drip and espresso from a local roaster.' },
  ],
  faqs: [
    {
      question: 'When do things sell out?',
      answer: 'Croissants and cardamom buns often go by 11am on weekends, and the country loaf by lunchtime. The second bake comes out around 11:30am — check the oven times above, and come early on Saturdays.',
    },
    {
      question: 'Can I reserve a loaf or pastries?',
      answer: 'Yes. Send us a note by 2pm the day before with what you’d like and when you’ll collect, and we’ll hold it under your name. We’ll reply to confirm — nothing is reserved until we do.',
    },
    {
      question: 'Do you slice bread?',
      answer: 'Happily, on any loaf. Tell us at the counter whether you’d like it thick or thin. Sliced bread goes stale faster, so freeze what you won’t eat in a day or two.',
    },
    {
      question: 'What about allergens and gluten?',
      answer: 'Everything is made in one small kitchen that handles wheat, rye, nuts, sesame, dairy and eggs. A few bakes use gluten-free ingredients, but we can’t guarantee anything is free from gluten or nuts. Please ask us before you buy if you have an allergy.',
    },
    {
      question: 'How should I freeze and reheat bread?',
      answer: 'Slice it, bag it and freeze it on the day you buy it. Toast slices from frozen, or refresh a whole loaf in a hot oven (425°F) for 10–12 minutes. Croissants revive in 5 minutes at 350°F.',
    },
    {
      question: 'Do you supply cafés and restaurants?',
      answer: 'We bake wholesale for a handful of neighbourhood cafés and restaurants. Send us a note with what you need and how often, and we’ll let you know if we have room on the morning bake.',
    },
  ],
  links: [
    // Add your public profiles. Entries with an empty URL are hidden, so no dead links ship.
    { label: 'Instagram', url: '' },
    { label: 'Google Maps', url: '' },
  ],
};

/** Profile links that have a URL. */
export const publicLinks = bakery.links.filter(link => link.url.trim() !== '');

/** Single-line postal address. */
export function formatAddress(address = bakery.address): string {
  return `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`;
}

/** "07:30" → "7:30am", "18:00" → "6pm". */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number);
  const suffix = h >= 12 && h < 24 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}

/** "7am – 3pm" or "Closed". */
export function formatHours(entry: OpeningHours): string {
  return entry.opens && entry.closes ? `${formatTime(entry.opens)} – ${formatTime(entry.closes)}` : 'Closed';
}

const short = (day: Day) => day.slice(0, 3);

/** Consecutive days with the same hours, e.g. [{ label: 'Tue – Fri', hours: '7am – 3pm' }]. */
export function groupedHours(hours = bakery.hours): { label: string; hours: string }[] {
  const groups: { days: Day[]; hours: string }[] = [];
  for (const entry of hours) {
    const text = formatHours(entry);
    const last = groups.at(-1);
    if (last && last.hours === text) last.days.push(entry.day);
    else groups.push({ days: [entry.day], hours: text });
  }
  return groups.map(group => ({
    label: group.days.length === 1 ? group.days[0] : `${short(group.days[0])} – ${short(group.days.at(-1)!)}`,
    hours: group.hours,
  }));
}

/** Days open, as a neutral label that is true at any time: "Every day", "Tue – Sun" or "Tue, Thu – Sat". */
export function openDaysLabel(hours = bakery.hours): string {
  const open = DAYS.filter(day => hours.some(entry => entry.day === day && entry.opens && entry.closes));
  if (open.length === 7) return 'Every day';
  const runs: Day[][] = [];
  for (const day of open) {
    const last = runs.at(-1);
    if (last && DAYS.indexOf(last.at(-1)!) === DAYS.indexOf(day) - 1) last.push(day);
    else runs.push([day]);
  }
  return runs.map(run => run.length === 1 ? short(run[0]) : `${short(run[0])} – ${short(run.at(-1)!)}`).join(', ');
}

/** Minutes after midnight for "HH:MM". */
export function toMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

export type OpenState = { open: true; closes: string } | { open: false; next?: { day: Day; opens: string } };

/**
 * Whether the bakery is open at a given local day/time. Pure, so it is unit tested and
 * the browser only supplies the current time in the bakery's time zone.
 */
export function openState(day: Day, minutes: number, hours = bakery.hours): OpenState {
  const today = hours.find(entry => entry.day === day);
  if (today?.opens && today.closes && minutes >= toMinutes(today.opens) && minutes < toMinutes(today.closes)) {
    return { open: true, closes: today.closes };
  }
  const start = DAYS.indexOf(day);
  for (let offset = 0; offset < 8; offset++) {
    const candidate = DAYS[(start + offset) % 7];
    const entry = hours.find(item => item.day === candidate);
    if (!entry?.opens || !entry.closes) continue;
    if (offset === 0 && minutes >= toMinutes(entry.opens)) continue;
    return { open: false, next: { day: candidate, opens: entry.opens } };
  }
  return { open: false };
}
