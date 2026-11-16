# Acme Bakehouse (Next.js)

A warm, flour-dusted theme for artisan bakeries: daily breads and pastries with out-of-the-oven times, sold-out flags, a celebration cakes gallery, opening hours, location and a [Jamstacks](https://jamstacks.net) contact component for custom cake and pre-order enquiries.

It exports to plain static files, deploys to GitHub Pages (custom domain or `/repository/` path) and works with no backend. Light mode is a "first bake" of flour-cream, parchment and crust brown; dark mode is an "oven glow" of scorched brown and ember orange. Both follow the visitor's device unless they pick one with the header toggle.

**Acme Bakehouse**, its bakes, cakes, prices and contact details are fictitious placeholders. The sample address is a public landmark, Union Square in San Francisco, so the map has something real to show. Replace all of them with your own.

## Pages

| Route | What's there |
| --- | --- |
| `/` | Bread-board hero with a live "open now" badge, then **Find us**: address, directions, opening hours and a Google map. Below that: the **Out of the oven** board (today's batches, "Just out", "Next batch at…"), favourites, the bakery's story, a celebration cakes invitation and FAQs |
| `/bakes/` | Every bake by section with prices, drawings, dietary tags, stickers, oven times, "Saturdays only" and "Sold out today" labels, section shortcuts and dietary filters, plus allergen notes |
| `/cakes/` | Celebration cakes as illustrated cards (flavours, sizes with servings and prices, minimum notice), then "How custom cakes work" |
| `/contact/` | "Custom cakes, pre-orders & enquiries": email and phone (always available) plus the hosted enquiry form when connected |
| any other URL | A friendly 404 ("This one didn't rise…") with links back |

## Quick start

Requires Node.js 24 or newer.

```sh
npm ci            # install exact locked dependencies
npm run dev       # http://localhost:3000 with live reload
npm test          # configuration, bakes, cakes, hours and oven-board checks
npm run typecheck
npm run build     # static export to out/
npm start         # serve out/ locally at http://localhost:3000/
npm run check     # test + typecheck + build in one go
```

No account, API key or network service is needed to run or build the website. Fonts are installed from npm and bundled at build time, so the build never fetches anything from a font service.

## Make it yours

Every page reads from three content files, so there are no duplicated strings to hunt down:

| File | What to change |
| --- | --- |
| [content/bakes.ts](content/bakes.ts) | Bake sections, bakes, prices and sizes, oven times, days baked, dietary tags, stickers, sold-out flags, favourites, allergy notes, currency |
| [content/cakes.ts](content/cakes.ts) | Celebration cakes (flavours, colours, sizes, servings, prices, notice) and "How custom cakes work" |
| [content/bakery.ts](content/bakery.ts) | Name, tagline, introduction, story, approach points, email, phone, address (plus an optional landmark/cross-streets `note`), directions, opening hours, notice, amenities, FAQs, social links |
| [app/tailwind.input.css](app/tailwind.input.css) | Colours (including the illustration palette), fonts and other customizations. Components are styled with Tailwind classes |
| `public/og.png` | 1200×630 social preview image |
| `app/icon.svg` | Browser tab icon |
| [site.config.json](site.config.json) | Site name/description, your time zone and public deployment settings (see below) |

### Maintaining the bakes

Each bake in `content/bakes.ts` looks like this:

```ts
{
  id: 'country-sourdough',            // unique; also the link /bakes/#country-sourdough
  name: 'Country sourdough',
  description: 'Our everyday loaf: a dark, blistered crust, open crumb and a gentle tang.',
  price: [{ label: 'Whole', amount: 9 }, { label: 'Half', amount: 5 }], // or a single number: 4.5
  art: 'boule',                       // boule, baguette, tin-loaf, focaccia, croissant, pain-au-chocolat,
                                      // bun, cookie, tart, cake-slice, sandwich
  color: '#a8622a',                   // tints the crust, filling or fruit in the drawing
  diet: ['vegan'],                    // vegan, vegetarian, contains-nuts, gluten-free-ingredients
  badge: 'signature',                 // optional: 'signature' | 'seasonal' | 'weekend' | 'new'
  featured: true,                     // optional: show in "Neighbourhood favourites" on the home page
  ovenTimes: ['07:00', '11:30'],      // local times each batch comes out
  // days: ['Saturday'],              // optional: only baked on these days
  // soldOut: true,                   // optional: sold out today
}
```

- **Sold out today?** Add `soldOut: true`. The bake stays listed, greyed out with a "Sold out today" sticker, and the oven board skips it for "Just out" and "Next batch". Remove the line when it's back.
- **Weekend or one-day bakes:** add `days: ['Saturday']` (or `['Saturday', 'Sunday']`). The bake shows "Saturdays only" / "Weekends only" and appears on the oven board only on those days.
- **Seasonal specials:** add a bake with `badge: 'seasonal'`, and delete it (or move it to `days`) when the season ends.
- **New section:** add `{ id, title, description, bakes: [...] }` to `sections`. It appears in the section shortcuts automatically.
- **Prices** are numbers in `bakes.currency` (`5` is $5, `5.5` is $5.50). Change `currency` and `locale` for other countries, e.g. `'GBP'` and `'en-GB'`.
- **Allergens:** vegan bakes count as vegetarian in the filters. `contains-nuts` powers the "No nuts" filter, so tag nuts carefully. There's deliberately no "gluten-free" tag: `gluten-free-ingredients` shows "GF*" with a note that the kitchen handles wheat.
- Keep 4–6 bakes `featured` so the home page grid stays balanced.

`npm test` checks the bakes after every edit: unique, URL-safe ids, valid prices and sizes, known tags and drawings, valid oven times that fall inside your opening hours on every day the bake is made, and days you're actually open. A failure names the bake and day to fix.

### Celebration cakes

Each cake in `content/cakes.ts` has `flavours` (sponge, filling, frosting), `colors` for its drawing (sponge, filling, frosting, decoration), a `style` (`frosted`, `naked` or `drip`), `tiers` (1–3), `sizes` (diameter in inches, servings and price), `leadDays` (minimum notice) and optional `diet` notes. The drawing is built from those values, so new cakes need no photos. Set `fromPrice: true` when the final price depends on the design; prices then read "from $…". Mark 2–3 cakes `featured` for the home page. `howItWorks` holds the 3–4 steps shown under the cakes.

The website never takes payment or confirms orders. Cake pages and Contact copy make clear that a message is an *enquiry* and that nothing is ordered or paid for until you reply.

### Hours, the "open now" badge and the oven board

`hours` in `content/bakery.ts` lists every day once with 24-hour `opens`/`closes` times in your local time. Leave both out for a closed day. Use `notice` for one-off messages such as holiday hours; leave it `''` to hide it. FAQs (`faqs`) appear at the bottom of the home page.

Your time zone is `timeZone` in [site.config.json](site.config.json), an IANA name such as `America/Los_Angeles` or `Europe/London`. If Jamstacks created this website, it's the time zone you chose in the portal. With it, in the visitor's browser and using *your* clock, refreshed every minute:

- the badge reads "Open now · until 3pm" or "Closed · opens Tuesday at 7am";
- the **Out of the oven** board narrows to today's bakes and marks batches "Just out!" (within 45 minutes), "Next batch" and "Out". Before opening it shows the first batch; after closing or on a closed day it shows the next opening day's schedule;
- the hours say "Times shown in Pacific Time" (or your zone), so visitors elsewhere don't read them as their own local time.

The built files never contain a stale time. Without a time zone, or without JavaScript, the badge shows a neutral "Open Tue – Sun" and the board shows every bake by oven time under the heading "Oven times", making no claim about today. An invalid zone name fails the build with a clear message.

### Location and map

Visitors most often look for where you are, so the home page puts the address, directions and hours directly under the hero, beside a Google map. The map and the "Get directions" and "Open in Google Maps" buttons all come from `address` in `content/bakery.ts`. There's nothing else to configure.

All three are free and need no Google account or API key:

- The links use Google's documented [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started).
- The map uses Google's keyless embed (the `google.com/maps/embed?pb=…` form that `google.com/maps?q=…&output=embed` redirects to). It's widely used but isn't a documented API. For Google's officially supported option, create a free [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) key restricted to your domain and change `mapEmbedUrl` in [lib/maps.ts](lib/maps.ts) to the `maps/embed/v1/place` form shown there. Embed API keys are meant to be public, so this is safe in a static site.

The map is lazy-loaded, so Google is only contacted when it scrolls into view. Google may set cookies in the embedded map, so mention it in your privacy notice if you have one. In dark mode a CSS filter (`--map-filter` in `app/tailwind.input.css`) warms it into a night map that matches the theme. Set it to `none` to show Google's normal colours.

Text is rendered as plain text, never HTML. Don't present invented reviews or awards as fact.

## Appearance

The header uses `DarkModeToggle` from the published `jamstacks` React package. The root layout supplies `ThemeProvider` and the early `ThemeScript`, so a saved preference applies before the first paint and stays consistent across navigation and tabs.

The hero bread board, bake drawings, cakes, stamps, wheat dividers and price tags are inline SVG/CSS coloured by tokens in `app/tailwind.input.css`. The same hero sits in soft morning window light in light mode and in front of a glowing wood-fired oven in dark mode; there are no image files to swap. Gentle animations (rising steam, drifting flour, the breathing oven glow and stickers settling on load) stop for visitors who prefer reduced motion.

Styling uses [Tailwind CSS v4](https://tailwindcss.com). Components use utility classes such as `bg-surface text-ink`, built from the template's own colour tokens; Tailwind's default palette is switched off so the look stays consistent. To change a colour, edit its variable in `app/tailwind.input.css` (light `:root` and both dark blocks, which must stay identical). To add one, such as a custom accent, add a variable there and map it in `@theme inline` (`--color-highlight: var(--highlight)` gives `bg-highlight`, `text-highlight` and so on).

Fonts are [Fraunces](https://fonts.google.com/specimen/Fraunces) for headings (its "soft" and "wonky" axes are used sparingly), [Figtree](https://fonts.google.com/specimen/Figtree) for text and [Caveat](https://fonts.google.com/specimen/Caveat) only for handwritten price tags and "just out" labels. All three are self-hosted through `@fontsource-variable` packages under the SIL Open Font License.

## Footer credit

The footer ends with "with ❤️ [jamstacks.net](https://jamstacks.net)". It's an ordinary link in [components/site-footer.tsx](components/site-footer.tsx). This is your website, so you can keep, reword or remove it.

## Configuration

`site.config.json` holds public deployment settings only. Jamstacks may rewrite this file when it sets up a repository for you; it never touches `content/`.

```json
{
  "name": "Acme Bakehouse",
  "description": "Sourdough, pastries and celebration cakes, baked by hand from first light. Today's bakes, oven times, opening hours and how to find us.",
  "domain": "",
  "timeZone": "America/Los_Angeles",
  "jamstacks": { "siteId": "", "cdnUrl": "https://cdn.jamstacks.net" }
}
```

Build-time environment variables override the file (blank values keep the file's value). See [.env.example](.env.example).

| Purpose | Local/build variable | GitHub Actions repository variable |
| --- | --- | --- |
| Public Jamstacks website ID | `JAMSTACKS_SITE` | `JAMSTACKS_SITE` |
| Component CDN base | `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | `JAMSTACKS_CDN_URL` |
| Display/canonical domain (hostname only) | `NEXT_PUBLIC_SITE_DOMAIN` | `SITE_DOMAIN` |
| Time zone for opening hours (IANA name) | `SITE_TIME_ZONE` | not needed; set `timeZone` in the file |
| Project-path prefix, e.g. `/my-bakery` | `PAGES_BASE_PATH` | set automatically from `actions/configure-pages` |
| Absolute site URL for canonical links/sitemap | `PAGES_BASE_URL` | set automatically from `actions/configure-pages` |

Every value here is **public** and ends up in the built files. Never put GitHub tokens, publishing keys or private email addresses in config or `.env` files. The public site ID identifies your website; it grants no administrative access.

Validation happens at build time ([lib/config.mjs](lib/config.mjs)): the site ID must be a single path-safe segment, the CDN must be HTTPS (path prefixes like `https://example.org/_cdn` are fine), the domain must be a bare hostname, and the base path must be a plain URL path. A `localhost` CDN is rejected unless you opt in with `JAMSTACKS_ALLOW_LOCAL_CDN=1`, and is always rejected in GitHub Actions so a public site can never depend on your machine.

GitHub may report an HTTP `PAGES_BASE_URL` while a new custom domain's HTTPS certificate is provisioning. The build accepts that URL and emits HTTPS canonical, social and sitemap URLs, so the first deployment can complete. When neither `PAGES_BASE_URL` nor a domain is known, canonical links and social images are omitted and `sitemap.xml` is empty, rather than guessing an origin.

The home page includes schema.org `Bakery` structured data (address, hours, contact, a `hasMenu` link to `/bakes/`) built from `content/bakery.ts`, which helps search engines and maps show your details.

## Contact and Jamstacks

**Without Jamstacks** (default): the Contact page shows your email with a copy button, your phone number and a short "useful to include" list (the date, servings, flavours or bakes, allergies). No Jamstacks script is requested anywhere.

**With Jamstacks**: create a website in the Jamstacks portal, configure the support form's copy (for example heading "Cakes, pre-orders & enquiries", name/email/message labels, button text and a success message such as "Thanks — we'll reply to confirm price and availability") and theme, and **publish** it. Then set `JAMSTACKS_SITE` (and `JAMSTACKS_CDN_URL` if you're not using `https://cdn.jamstacks.net`) and rebuild. The Contact page then renders:

```html
<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="site_…"></jamstacks-support-form>
<!-- plus, after hydration, one script: {cdn}/sites/{siteId}/embed.js -->
```

How it behaves:

- The hosted component renders inside the tag (in its own shadow root) and owns validation, spam protection, submission and the success/error messages. This template never submits messages, never registers the element itself and never shows a success message of its own.
- Your email stays visible next to the form at all times. If the script can't load, a short message offers the email instead; if the form is slow to appear, a gentle note does the same. With JavaScript disabled, the page points to email.
- Form text and theme changes you publish in the portal appear after a reload (allow for the CDN cache interval) — no rebuild needed. Changing bakes, cakes, hours or the site ID does need a rebuild.
- The form supports name, email and message today. Keep page copy framed as an enquiry: don't promise ordering, payment, date pickers, photo uploads or extra fields.
- Only the Contact page loads the Jamstacks script.

**Why Contact uses full page loads:** the current shared runtime finds the form's host when its script runs and stops watching for new hosts after ten seconds; it has no public "remount" API. Links to and from Contact therefore do an ordinary full page load (all other links use fast client-side navigation), so the form appears reliably. This is handled by [components/site-link.tsx](components/site-link.tsx).

**Styling:** the page maps its design tokens to the shared `--jamstacks-*` CSS variables in [app/tailwind.input.css](app/tailwind.input.css). In dark mode the form's primary colour stays a deep crust brown so its white button text remains readable. A theme you publish in the portal overrides these on the component itself. Don't style the component's internals; they're owned by the runtime.

**Content Security Policy:** none is set by this template. If you add one, allow scripts from your Jamstacks CDN origin, the spam-check provider used by the form (`https://challenges.cloudflare.com` for scripts and frames), `connect-src` to the API origin your published form uses, and `frame-src https://www.google.com` for the map. Inline structured data and the theme script also need a nonce or hash. Avoid wildcards and `unsafe-eval`.

## Deploy to GitHub Pages

The workflow at [.github/workflows/pages.yml](.github/workflows/pages.yml) tests, type-checks, builds and deploys on every push to `main`, validates pull requests without deploying, and can be run manually.

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Optional: **Settings → Secrets and variables → Actions → Variables**: add `JAMSTACKS_SITE`, `JAMSTACKS_CDN_URL`, `SITE_DOMAIN`. These are *variables*, not secrets — they're public.
4. Push to `main` or run the workflow from the Actions tab.

The site works at `https://<owner>.github.io/<repository>/`; the workflow reads the correct path prefix from GitHub. To preview a project-path build locally:

```sh
PAGES_BASE_PATH=/bakery-preview npm run build
node scripts/serve.mjs --base /bakery-preview   # http://localhost:3000/bakery-preview/
```

**Custom domain:** set it in **Settings → Pages → Custom domain** and create the DNS records GitHub shows you. Setting `SITE_DOMAIN` alone does not configure a domain; it only informs canonical URLs.

**Jamstacks provisioning:** if Jamstacks created this repository for you, it already enabled Pages, set the repository variables and started the first run. Its runs appear as `Jamstacks <operation id>` (the workflow's optional `provisioning_id` input). Keep the workflow's file path, inputs and run name if you edit it.

## Local Jamstacks development

For working against a locally running Jamstacks service (portal at `https://localhost:5001`, assets at `https://localhost:5001/_cdn`):

```sh
JAMSTACKS_SITE=site_… \
NEXT_PUBLIC_JAMSTACKS_CDN_URL=https://localhost:5001/_cdn \
JAMSTACKS_ALLOW_LOCAL_CDN=1 npm run dev
```

This website uses Next.js's default port 3000. Trust the local development certificate in your browser and register `http://localhost:3000` as an allowed origin for the website in the portal; the service refuses submissions from origins it doesn't know.

## Project structure

```
app/                  routes, metadata, sitemap/robots, global styles and tokens
components/           header, footer, hero scene, oven board, bake list and drawings, cake drawings,
                      doodles (stamp, price tag, divider), open badge, Jamstacks host/loader
content/              bakery.ts, bakes.ts and cakes.ts — your content
lib/config.mjs        build-time public config resolution and validation
lib/oven.ts           "Out of the oven" schedule logic (unit tested)
lib/local-time.ts     the current weekday and minute in the bakery's time zone
lib/bake-filter.ts    dietary filter rules
lib/paths.ts          base-path-aware links and asset URLs
lib/structured-data.ts  schema.org Bakery data
lib/time-zone.ts      readable time zone names for the hours
lib/maps.ts           Google Maps embed, search and directions URLs
lib/embed-status.ts   observable states of the hosted form
types/jamstacks.d.ts  typed JSX for <jamstacks-support-form>
public/               social preview image
scripts/serve.mjs     static preview server (with base path support)
tests/                node:test suites
site.config.json      public deployment settings (provisioner-compatible)
jamstacks/            optional template publishing metadata and gallery captures
```

## Before publishing your website

- Replace Acme Bakehouse, the address (and its `note`), directions, email, phone, bakes, oven times, cakes, prices, FAQs and social links with your own details.
- Set your real opening hours and `timeZone` in `site.config.json`, and check the "open now" badge and oven board on the home page.
- Check every allergen tag and the allergy notes with your kitchen.
- Update the site title/description, icon and social preview image. Set the correct public domain or Pages URL for canonical links.
- Run `npm run check` and a project-path build when using a repository URL.
- Check the pages on phone and desktop, in light and dark, with keyboard navigation and the Contact fallback.
- If you connect Jamstacks, publish the form in the portal and verify a real test message reaches the website inbox. A successful build does not verify message delivery.

`AGENTS.md` gives coding assistants the same architecture and editing guidance.

## Optional template publishing folder

`jamstacks/` is used only to publish this source template in the Jamstacks gallery:

```text
jamstacks/config.json       template metadata and screenshot paths
jamstacks/screenshots.json  capture viewport, hashes and sizes
jamstacks/home-light.jpg    light homepage preview
jamstacks/home-dark.jpg     dark homepage preview
jamstacks/config.test.mjs   source-template publishing checks
```

Run `node --test jamstacks/config.test.mjs` when maintaining the source template.
When creating a customer website, the whole `jamstacks/` folder can be removed.
Normal `npm test`, type checking, builds and the Pages workflow do not depend on it.
Keep `site.config.json`, the website's embed integration and `.github/workflows/pages.yml`;
these belong to the customer website and continue to work without gallery metadata.
