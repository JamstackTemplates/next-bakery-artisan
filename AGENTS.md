# Working on this website

This is a customer-owned Next.js website for a bakery. Read [README.md](README.md) for setup,
content editing, deployment and the optional Jamstacks contact form.

## Working preferences

- Work in this repository on its current branch unless asked otherwise.
- Preserve existing changes. Leave edits uncommitted; push or deploy only when requested.
- Adapt the website to its owner's requested content and features. Replace the sample bakery,
  bakes, cakes, address and contact details with the owner's real details; the fictional examples are starting content.

## Structure and content

- `content/bakes.ts` owns bake sections, bakes, prices/sizes, drawings and colours, dietary tags,
  stickers (`signature`, `seasonal`, `weekend`, `new`), oven times (`ovenTimes`), days baked (`days`),
  home page favourites (`featured: true`) and allergy notes. `soldOut: true` marks a bake sold out today;
  it stays listed. Most owner requests ("add a loaf", "raise the croissant price", "the almond croissants
  are sold out", "rye on Saturdays only") are edits here only.
- `content/cakes.ts` owns celebration cakes (flavours, drawing colours, style, tiers, sizes with servings
  and prices, `leadDays` notice, diet notes, `featured`) and the "How custom cakes work" steps.
- `content/bakery.ts` owns the bakery name, story, approach points, contact details, address,
  opening hours (local times), notice, amenities, FAQs and social links.
- The address in `content/bakery.ts` drives the home page "Find us" section, Google map, directions links and
  structured data. Maps use keyless Google URLs from `lib/maps.ts`; never add a secret key, and keep the map lazy-loaded.
- The bakery's time zone is the IANA `timeZone` in `site.config.json` (Jamstacks writes the owner's choice
  there). Change it there, not in content; without it the open-now badge and oven board stay neutral.
- Oven times must fall within opening hours on every day a bake is made, and `days` must be days the
  bakery is open; `npm test` names the bake and day to fix.
- Keep section, bake and cake ids unique, lowercase and hyphenated; they are page anchors. Use an existing
  `art` drawing and a `color` for new bakes, and `colors`/`style`/`tiers` for new cakes, rather than adding image files.
- Never promise a bake is gluten-free. Use the `gluten-free-ingredients` tag, which carries the cross-contamination note.
- Colours, including the illustration palette for light ("first bake") and dark ("oven glow"), are tokens in
  `app/tailwind.input.css` (see Styling).
- Keep content separate from `site.config.json`: Jamstacks may rewrite deployment fields there.
- Text is rendered as plain text. Don't invent reviews, awards or claims for a real business.

## Styling (Tailwind CSS v4)

- Style components with Tailwind utility classes in the TSX. Don't add global CSS for one-off styles.
- `app/tailwind.input.css` holds everything utilities can't express: the colour tokens (`:root` for light,
  plus two dark blocks that must stay identical), the `@theme` built from them, base element styles,
  shared building blocks (`.button`, `.button-ghost`, `.text-link`, `.eyebrow`, `.chip`, `.sticker`, `.card`,
  `.kraft`, `.price-tag`), the illustrations and animation, and styles driven by data attributes.
- Only this template's palette exists (`bg`, `band`, `surface`, `kraft`, `ink`, `muted`, `line`, `accent`, `wheat`,
  `sage`, `footer` and their variants). Tailwind's default colours are switched off. To add a
  colour, such as a custom accent, add a variable to `:root` and both dark blocks, then map it in
  `@theme inline` as `--color-name: var(--variable)` to get `bg-name`, `text-name` and so on.
- Colours switch with the theme through the tokens, so prefer them to `dark:` variants (`dark:` follows `html.dark`).
- Fonts: Fraunces for headings, Figtree for text, Caveat (`font-hand`) only for small price tags and "just out" labels.
- Reuse the building blocks and existing components (`PageHead`, `BakeArt`, `CakeArt`, `PriceTag`, `WheatDivider`)
  instead of restyling each instance. Add a reusable layout helper with `@utility`.
- Keep the `--jamstacks-*` component variables mapped to the tokens. Preserve readable contrast in both
  themes, responsive layouts from 360px, visible keyboard focus, semantic headings and reduced-motion support
  (every animation stops under `prefers-reduced-motion`).

## Static architecture

- Production is a static export in `out/`. Preserve static-export compatibility; no
  request-time rendering, API routes, Server Actions, database or production Next.js server.
- Use local content for pages and ordinary client code for browser-only interactions
  (the open-now badge, the oven board, bake filters, copy button). Time-dependent text ("Open now", "Just out",
  "Next batch at…") is computed in the browser from the bakery's time zone, never at build time. The schedule
  logic lives in `lib/oven.ts` with unit tests in `tests/oven.test.ts`.
- Preserve both custom-domain root URLs and arbitrary GitHub Pages repository paths.
  Use the shared path helpers and `SiteLink` for links, images and metadata.
- Read relevant installed Next.js guides in `node_modules/next/dist/docs/` before
  changing framework behavior. Keep dependencies modest and the npm lockfile reproducible.

## Optional Jamstacks form

- Keep the integration documented in README.md. The host is `<jamstacks-support-form>`
  with `data-jamstacks-component="support-form"` and `data-jamstacks-site` attributes.
- `JAMSTACKS_SITE` is a public website ID. Load one configured CDN bootstrap at
  `/sites/{publicSiteId}/embed.js`; no ID means no script request and a useful email fallback.
- The shared runtime owns form rendering, validation, spam protection and submission.
  Do not copy it, register a replacement element, intercept submission or simulate success.
- Preserve the documented full-document Contact navigation until a supported remount
  contract is available. Keep the email fallback usable during outages.
- The form supports name, email and message. Page copy must present a message as an enquiry: don't promise
  ordering, payment, bookings, attachments or extra fields.
- Style through supported `--jamstacks-*` CSS variables; do not reach into shadow-root internals.
- Configuration and build-time environment values are public. Never put credentials,
  publishing keys or private notification recipients in them. Remote builds must not depend on localhost.
- Preserve `.github/workflows/pages.yml`, its optional `provisioning_id` input and correlated
  run name when changing the workflow. Pull requests validate without deploying.

## Commands and checks

```sh
npm ci
npm run dev       # http://localhost:3000
npm test          # bakes, cakes, hours, oven board, config and embed checks
npm run typecheck
npm run build     # static export
npm run check     # all three
PAGES_BASE_PATH=/bakery-preview npm run build
```

Run `npm run check` after every content or code change; test failures name the bake, cake or day to fix.
`npm start` previews the export on port 3000; stop the dev server first, or use
`npm start -- --port 3200`. Browser-check affected routes in light and dark, and root/project-path
assets when changing layout, navigation or deployment behavior. Report local
checks separately from any actual GitHub deployment or accepted contact submission.

## Template publishing assets

- `jamstacks/` contains optional source-template metadata, gallery captures and their checks.
- Read `jamstacks/config.json`; capture evidence is `jamstacks/screenshots.json` and JPEGs stay directly inside `jamstacks/`.
- Run `node --test jamstacks/config.test.mjs` only when maintaining a source template.
- Customer websites can remove this entire folder. Normal tests, website code, builds and the Pages workflow must not import it.
- Keep `site.config.json`, embed integration and the Pages workflow outside the optional folder.
