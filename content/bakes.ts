// Daily breads, pastries and lunch bakes. Add, remove, reorder or reprice bakes here;
// every page (and the home page "Out of the oven" board) reads from this file.
// Names and prices are placeholders — replace them with your own.
// Plain strings only: text is rendered as text, never as HTML.
import type { Day } from './bakery';

/**
 * Dietary markers shown as tags and used by the filters on /bakes/.
 * There is deliberately no "gluten-free" tag: a bakery kitchen can't promise that.
 * `gluten-free-ingredients` means the recipe has no gluten, but it's made beside wheat.
 */
export type Diet = 'vegan' | 'vegetarian' | 'contains-nuts' | 'gluten-free-ingredients';

export const DIETS: Record<Diet, { label: string; short: string }> = {
  vegan: { label: 'Vegan', short: 'VG' },
  vegetarian: { label: 'Vegetarian', short: 'V' },
  'contains-nuts': { label: 'Contains nuts', short: 'N' },
  'gluten-free-ingredients': { label: 'Gluten-free ingredients, made in a kitchen that handles wheat', short: 'GF*' },
};

/** Little drawing shown with a bake, tinted by `color`. See components/bake-art.tsx. */
export type Art =
  | 'boule' | 'baguette' | 'tin-loaf' | 'focaccia' | 'croissant' | 'pain-au-chocolat'
  | 'bun' | 'cookie' | 'tart' | 'cake-slice' | 'sandwich';

export const ARTS: readonly Art[] = ['boule', 'baguette', 'tin-loaf', 'focaccia', 'croissant', 'pain-au-chocolat', 'bun', 'cookie', 'tart', 'cake-slice', 'sandwich'];

/** Sticker shown on a bake. */
export type Badge = 'signature' | 'seasonal' | 'weekend' | 'new';

export const BADGES: Record<Badge, string> = { signature: 'House signature', seasonal: 'Seasonal', weekend: 'Weekend bake', new: 'New' };

export interface SizePrice {
  /** e.g. "Whole", "Half", "Slice", "Tray". */
  label: string;
  amount: number;
}

export interface Bake {
  /** Unique, URL-safe id used for links such as /bakes/#country-sourdough. */
  id: string;
  name: string;
  description: string;
  /** One price, or a price per size. Amounts are in `bakes.currency`, e.g. 4.5 for $4.50. */
  price: number | SizePrice[];
  /** Little drawing: boule, baguette, tin-loaf, focaccia, croissant, pain-au-chocolat, bun, cookie, tart, cake-slice, sandwich. */
  art: Art;
  /** Main colour of the drawing: the crust, filling or fruit. Any CSS colour. */
  color: string;
  diet?: Diet[];
  /** Optional sticker. Use `weekend` together with `days`. */
  badge?: Badge;
  /** Show on the home page "Favourites". Keep 4–6 featured. */
  featured?: boolean;
  /** Sold out today. The bake stays listed with a "Sold out" label; remove the line when it's back. */
  soldOut?: boolean;
  /** Local 24-hour "HH:MM" times when each batch comes out of the oven, e.g. ['07:00', '11:30']. */
  ovenTimes: string[];
  /** Weekdays it's baked, e.g. ['Saturday']. Leave out for every day you're open. */
  days?: Day[];
}

export interface BakeSection {
  /** Unique, URL-safe id used for links such as /bakes/#bread. */
  id: string;
  title: string;
  /** Short line shown under the section title. */
  description: string;
  bakes: Bake[];
}

export interface BakeMenu {
  /** ISO 4217 currency code. */
  currency: string;
  /** Locale used to format prices, e.g. "en-US", "en-GB". */
  locale: string;
  sections: BakeSection[];
  /** Small print beside the list, e.g. allergy advice. */
  notes: string[];
}

export const bakes: BakeMenu = {
  currency: 'USD',
  locale: 'en-US',
  sections: [
    {
      id: 'bread',
      title: 'Bread',
      description: 'Naturally leavened with our levain and fermented slowly overnight. Sliced to order.',
      bakes: [
        {
          id: 'country-sourdough',
          name: 'Country sourdough',
          description: 'Our everyday loaf: a dark, blistered crust, open crumb and a gentle tang. 36-hour ferment.',
          price: [{ label: 'Whole', amount: 9 }, { label: 'Half', amount: 5 }],
          art: 'boule',
          color: '#a8622a',
          diet: ['vegan'],
          badge: 'signature',
          featured: true,
          ovenTimes: ['07:00', '11:30'],
        },
        {
          id: 'baguette',
          name: 'Baguette',
          description: 'Thin, crackling crust and a creamy crumb. Best within a few hours — that’s why we bake three times.',
          price: 4.5,
          art: 'baguette',
          color: '#c27a3a',
          diet: ['vegan'],
          ovenTimes: ['07:00', '09:30', '12:00'],
        },
        {
          id: 'spelt-honey-loaf',
          name: 'Spelt & honey tin',
          description: 'Soft, nutty wholegrain spelt with wildflower honey. The toast loaf.',
          price: 9.5,
          art: 'tin-loaf',
          color: '#b77a42',
          diet: ['vegetarian'],
          ovenTimes: ['09:00'],
        },
        {
          id: 'seeded-rye',
          name: 'Seeded rye',
          description: 'Dense Danish-style rye packed with sunflower, flax and pumpkin seeds. Slice thin, keeps all week.',
          price: 10,
          art: 'tin-loaf',
          color: '#5e3a22',
          diet: ['vegan'],
          badge: 'weekend',
          ovenTimes: ['08:00'],
          days: ['Saturday'],
        },
        {
          id: 'walnut-raisin',
          name: 'Walnut & raisin bâtard',
          description: 'Toasted walnuts and plump raisins in a rye-sweetened dough. Brilliant with cheese.',
          price: 10,
          art: 'boule',
          color: '#7d4a26',
          diet: ['vegan', 'contains-nuts'],
          ovenTimes: ['10:00'],
          days: ['Friday', 'Saturday', 'Sunday'],
        },
      ],
    },
    {
      id: 'pastries',
      title: 'Pastries & viennoiserie',
      description: 'Laminated over three days with cultured butter. First tray at opening, second mid-morning.',
      bakes: [
        {
          id: 'butter-croissant',
          name: 'Butter croissant',
          description: 'Shatteringly crisp outside, honeycomb within. Cultured butter, nothing else to hide behind.',
          price: 4.75,
          art: 'croissant',
          color: '#d48a3a',
          diet: ['vegetarian'],
          badge: 'signature',
          featured: true,
          ovenTimes: ['07:00', '10:00'],
        },
        {
          id: 'pain-au-chocolat',
          name: 'Pain au chocolat',
          description: 'Two batons of 70% dark chocolate rolled into croissant dough.',
          price: 5.25,
          art: 'pain-au-chocolat',
          color: '#c98236',
          diet: ['vegetarian'],
          ovenTimes: ['07:00', '10:00'],
        },
        {
          id: 'almond-croissant',
          name: 'Almond croissant',
          description: 'Yesterday’s croissant, soaked in syrup, filled with frangipane and baked again under flaked almonds.',
          price: 5.75,
          art: 'croissant',
          color: '#e0b06a',
          diet: ['vegetarian', 'contains-nuts'],
          soldOut: true,
          ovenTimes: ['08:30'],
        },
        {
          id: 'cardamom-bun',
          name: 'Cardamom bun',
          description: 'Knotted, buttery and fragrant with freshly ground cardamom and pearl sugar.',
          price: 5,
          art: 'bun',
          color: '#b8692e',
          diet: ['vegetarian'],
          featured: true,
          ovenTimes: ['07:30', '11:00'],
        },
        {
          id: 'morning-bun',
          name: 'Morning bun',
          description: 'Croissant dough rolled with orange zest and cinnamon sugar, baked in a tin until caramelised.',
          price: 5,
          art: 'bun',
          color: '#c77a35',
          diet: ['vegetarian'],
          ovenTimes: ['07:30'],
        },
        {
          id: 'spiced-pear-danish',
          name: 'Spiced pear danish',
          description: 'Poached Bartlett pear, vanilla custard and a little clove on a flaky danish base. Autumn only.',
          price: 5.5,
          art: 'tart',
          color: '#c9b04a',
          diet: ['vegetarian'],
          badge: 'seasonal',
          featured: true,
          ovenTimes: ['09:30'],
        },
      ],
    },
    {
      id: 'sweet',
      title: 'Sweet things',
      description: 'Cookies, tarts and slices for the afternoon slump, or for the walk home.',
      bakes: [
        {
          id: 'brown-butter-cookie',
          name: 'Brown butter cookie',
          description: 'Nutty brown butter, dark chocolate chunks and flaky salt. Chewy middle, crisp edge.',
          price: 3.75,
          art: 'cookie',
          color: '#b97a3c',
          diet: ['vegetarian'],
          featured: true,
          ovenTimes: ['09:00', '12:30'],
        },
        {
          id: 'oat-tahini-cookie',
          name: 'Oat, tahini & chocolate cookie',
          description: 'Rolled oats, tahini and dark chocolate, sweetened with maple. Contains sesame.',
          price: 3.75,
          art: 'cookie',
          color: '#a77845',
          diet: ['vegan', 'gluten-free-ingredients'],
          badge: 'new',
          ovenTimes: ['09:00'],
        },
        {
          id: 'market-fruit-tart',
          name: 'Market fruit tart',
          description: 'Sweet shortcrust, vanilla crème pâtissière and whatever looked best at the market this week.',
          price: 7,
          art: 'tart',
          color: '#c4405a',
          diet: ['vegetarian'],
          ovenTimes: ['10:30'],
        },
        {
          id: 'olive-oil-clementine-cake',
          name: 'Olive oil & clementine cake',
          description: 'A moist, fragrant slice made with whole clementines and peppery olive oil.',
          price: 5.5,
          art: 'cake-slice',
          color: '#e8902c',
          diet: ['vegan'],
          ovenTimes: ['09:30'],
        },
        {
          id: 'chocolate-babka',
          name: 'Chocolate babka',
          description: 'Brioche twisted with dark chocolate and cocoa, glazed with syrup. Sold whole or by the slice.',
          price: [{ label: 'Slice', amount: 5 }, { label: 'Whole', amount: 18 }],
          art: 'cake-slice',
          color: '#5a3020',
          diet: ['vegetarian'],
          badge: 'weekend',
          ovenTimes: ['09:30'],
          days: ['Saturday', 'Sunday'],
        },
      ],
    },
    {
      id: 'savoury',
      title: 'Savoury & lunch',
      description: 'Focaccia, filled croissants, quiche and sandwiches on our own bread, from late morning.',
      bakes: [
        {
          id: 'rosemary-focaccia',
          name: 'Rosemary & sea salt focaccia',
          description: 'Olive-oil-rich, dimpled and golden, with fresh rosemary and flaky salt.',
          price: [{ label: 'Square', amount: 4.5 }, { label: 'Half tray', amount: 16 }],
          art: 'focaccia',
          color: '#d9a44a',
          diet: ['vegan'],
          featured: true,
          ovenTimes: ['10:00', '12:00'],
        },
        {
          id: 'ham-gruyere-croissant',
          name: 'Ham & Gruyère croissant',
          description: 'Smoked ham, aged Gruyère and Dijon béchamel baked into croissant dough.',
          price: 7.5,
          art: 'croissant',
          color: '#c97d3a',
          ovenTimes: ['10:30'],
        },
        {
          id: 'leek-cheddar-quiche',
          name: 'Leek, cheddar & thyme quiche',
          description: 'Deep-filled, just-set custard in an all-butter crust. Served warm, by the slice.',
          price: 8,
          art: 'tart',
          color: '#e6c25a',
          diet: ['vegetarian'],
          ovenTimes: ['11:00'],
        },
        {
          id: 'squash-feta-sandwich',
          name: 'Roast squash & whipped feta',
          description: 'Roast delicata squash, whipped feta, pickled shallot and greens on country sourdough.',
          price: 12,
          art: 'sandwich',
          color: '#e0893a',
          diet: ['vegetarian'],
          badge: 'seasonal',
          ovenTimes: ['11:30'],
        },
        {
          id: 'tomato-focaccia-sandwich',
          name: 'Tomato & basil focaccia sandwich',
          description: 'Marinated tomatoes, basil and garlicky white bean spread in a square of focaccia.',
          price: 11,
          art: 'sandwich',
          color: '#d2452f',
          diet: ['vegan'],
          ovenTimes: ['11:30'],
        },
      ],
    },
  ],
  notes: [
    'VG vegan · V vegetarian · N contains nuts · GF* gluten-free ingredients.',
    'Everything is made in one kitchen that handles wheat, rye, nuts, sesame, dairy and eggs, so we can’t promise anything is free from them. Please ask before you buy if you have an allergy.',
  ],
};

/** Every bake, in list order. */
export const allBakes: Bake[] = bakes.sections.flatMap(section => section.bakes);

/** Bakes shown in the home page "Favourites". */
export const featuredBakes: Bake[] = allBakes.filter(bake => bake.featured);

const formatter = new Intl.NumberFormat(bakes.locale, { style: 'currency', currency: bakes.currency });

/** "$4.50", or "$4" for whole amounts. */
export function formatPrice(amount: number): string {
  if (amount === 0) return 'Free';
  const text = formatter.format(amount);
  return Number.isInteger(amount) ? text.replace(/[.,]00(?=\D*$)/, '') : text;
}

/** Lowest price, for compact cards. */
export function startingPrice(bake: Bake): number {
  return typeof bake.price === 'number' ? bake.price : Math.min(...bake.price.map(size => size.amount));
}

const SHORT_DAY: Record<Day, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};

/** "Saturdays only", "Weekends only", "Fri, Sat & Sun only", or '' for daily bakes. */
export function bakeDaysLabel(bake: Pick<Bake, 'days'>): string {
  const days = bake.days ?? [];
  if (!days.length) return '';
  if (days.length === 1) return `${days[0]}s only`;
  if (days.length === 2 && days.includes('Saturday') && days.includes('Sunday')) return 'Weekends only';
  const names = days.map(day => SHORT_DAY[day]);
  return `${names.slice(0, -1).join(', ')} & ${names.at(-1)} only`;
}
