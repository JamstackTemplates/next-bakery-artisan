// Celebration cakes, made to order. Each cake is drawn from its `colors`, so new cakes need no image files.
// Names, sizes and prices are placeholders — replace them with your own.
// Plain strings only: text is rendered as text, never as HTML.

export interface CakeSize {
  /** Diameter in inches, e.g. 6 for a 6" cake. For tiered cakes, the bottom tier. */
  diameter: number;
  /** Roughly how many people it serves. */
  servings: number;
  /** Price in the bakes currency (content/bakes.ts), e.g. 58 for $58. */
  price: number;
  /** Optional label for tiered sizes, e.g. "Two tiers". */
  label?: string;
}

export interface Cake {
  /** Unique, URL-safe id used for links such as /cakes/#chocolate-sour-cherry. */
  id: string;
  name: string;
  description: string;
  flavours: {
    sponge: string;
    filling: string;
    frosting: string;
  };
  /** Colours for the drawing. Any CSS colour. */
  colors: {
    sponge: string;
    filling: string;
    frosting: string;
    /** Fruit, flowers or sprinkles on top. */
    decoration: string;
  };
  /**
   * How the drawing looks: `frosted` (fully covered), `naked` (sponge showing through a thin scrape),
   * or `drip` (a ganache drip over the top edge).
   */
  style: 'frosted' | 'naked' | 'drip';
  /** Number of tiers drawn, 1–3. */
  tiers: 1 | 2 | 3;
  sizes: CakeSize[];
  /** True when sizes show a starting price ("from $…") because the final price depends on the design. */
  fromPrice?: boolean;
  /** Minimum notice in days. */
  leadDays: number;
  /** Optional allergy or diet notes, e.g. "Vegan", "Contains nuts". */
  diet?: string[];
  /** Show on the home page cakes invitation. Keep 2–3 featured. */
  featured?: boolean;
}

/** One step of "How custom cakes work". */
export interface CakeStep {
  title: string;
  detail: string;
}

export const cakes: Cake[] = [
  {
    id: 'chocolate-sour-cherry',
    name: 'Chocolate & sour cherry',
    description: 'Dark, tender chocolate sponge layered with sour cherry compote and finished with a glossy ganache drip.',
    flavours: { sponge: 'Dark chocolate', filling: 'Sour cherry compote', frosting: 'Chocolate ganache & vanilla cream' },
    colors: { sponge: '#4a2418', filling: '#a3243a', frosting: '#f3e6d6', decoration: '#b0182f' },
    style: 'drip',
    tiers: 1,
    sizes: [
      { diameter: 6, servings: 10, price: 62 },
      { diameter: 8, servings: 18, price: 88 },
      { diameter: 10, servings: 28, price: 120 },
    ],
    leadDays: 3,
    featured: true,
  },
  {
    id: 'lemon-elderflower',
    name: 'Lemon & elderflower',
    description: 'Light lemon sponge brushed with elderflower syrup, sharp lemon curd and soft Swiss meringue buttercream.',
    flavours: { sponge: 'Lemon', filling: 'Lemon curd & elderflower syrup', frosting: 'Swiss meringue buttercream' },
    colors: { sponge: '#f1d27a', filling: '#f0c419', frosting: '#fbf4e4', decoration: '#e9e4b0' },
    style: 'frosted',
    tiers: 1,
    sizes: [
      { diameter: 6, servings: 10, price: 58 },
      { diameter: 8, servings: 18, price: 82 },
      { diameter: 10, servings: 28, price: 112 },
    ],
    leadDays: 3,
    featured: true,
  },
  {
    id: 'carrot-brown-butter',
    name: 'Carrot & brown butter',
    description: 'Spiced carrot sponge with toasted pecans, brown butter cream cheese frosting and candied carrot ribbons.',
    flavours: { sponge: 'Spiced carrot & pecan', filling: 'Brown butter cream cheese', frosting: 'Brown butter cream cheese' },
    colors: { sponge: '#c9783a', filling: '#f2e2c4', frosting: '#f0dfc0', decoration: '#e06a1f' },
    style: 'naked',
    tiers: 1,
    sizes: [
      { diameter: 6, servings: 10, price: 60 },
      { diameter: 8, servings: 18, price: 85 },
    ],
    leadDays: 2,
    diet: ['Contains nuts'],
  },
  {
    id: 'vegan-chocolate-raspberry',
    name: 'Vegan chocolate & raspberry',
    description: 'Our vegan cocoa sponge with raspberry jam and whipped dark chocolate frosting. No one ever guesses.',
    flavours: { sponge: 'Cocoa (vegan)', filling: 'Raspberry jam', frosting: 'Whipped dark chocolate' },
    colors: { sponge: '#3e2016', filling: '#c2304f', frosting: '#5b3324', decoration: '#d63c5e' },
    style: 'frosted',
    tiers: 1,
    sizes: [
      { diameter: 6, servings: 10, price: 64 },
      { diameter: 8, servings: 18, price: 90 },
    ],
    leadDays: 3,
    diet: ['Vegan'],
    featured: true,
  },
  {
    id: 'pistachio-rose',
    name: 'Pistachio & rose',
    description: 'Pistachio sponge with rose-scented cream and raspberries, finished with crushed pistachios and petals.',
    flavours: { sponge: 'Pistachio', filling: 'Rose cream & raspberry', frosting: 'Vanilla buttercream' },
    colors: { sponge: '#a7b56a', filling: '#e9a3b0', frosting: '#f6ece0', decoration: '#d9667e' },
    style: 'naked',
    tiers: 1,
    sizes: [
      { diameter: 6, servings: 10, price: 66 },
      { diameter: 8, servings: 18, price: 94 },
    ],
    leadDays: 4,
    diet: ['Contains nuts'],
  },
  {
    id: 'naked-wedding-tier',
    name: 'Naked celebration tiers',
    description: 'Two or three tiers of vanilla bean sponge, berries and lightly scraped buttercream, dressed with seasonal flowers. Flavours can be mixed by tier.',
    flavours: { sponge: 'Vanilla bean (or any flavour above)', filling: 'Seasonal berries & vanilla cream', frosting: 'Scraped vanilla buttercream' },
    colors: { sponge: '#efcf8f', filling: '#b8344c', frosting: '#fbf3e6', decoration: '#e8a9b8' },
    style: 'naked',
    tiers: 3,
    sizes: [
      { label: 'Two tiers', diameter: 8, servings: 40, price: 240 },
      { label: 'Three tiers', diameter: 10, servings: 75, price: 420 },
    ],
    fromPrice: true,
    leadDays: 21,
  },
];

export const howItWorks: CakeStep[] = [
  {
    title: 'Send us a note',
    detail: 'Tell us the date, roughly how many people, the flavour you like and any allergies. If you have a design in mind, describe it in a sentence or two.',
  },
  {
    title: 'We confirm price and availability',
    detail: 'We reply within two working days with a price and whether we have room in the oven that day. Nothing is booked yet.',
  },
  {
    title: 'Deposit and pickup details by email',
    detail: 'If you’d like to go ahead, we email how to pay a deposit and when to collect. Payment is never taken through this website.',
  },
  {
    title: 'Collect from the bakery',
    detail: 'Pick up on the day, boxed and ready. We’ll talk you through carrying and storing it.',
  },
];

/** Cakes shown on the home page. */
export const featuredCakes: Cake[] = cakes.filter(cake => cake.featured);

/** Smallest price, for compact cards. */
export function cakeStartingPrice(cake: Cake): number {
  return Math.min(...cake.sizes.map(size => size.price));
}
