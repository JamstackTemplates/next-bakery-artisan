import type { Metadata } from 'next';
import { BakeArt } from '../components/bake-art';
import { CakeArt } from '../components/cake-art';
import { BakedTodayStamp, PriceTag, WheatDivider } from '../components/doodles';
import { GoogleMap } from '../components/google-map';
import { HeroImage } from '../components/hero-image';
import { Icon } from '../components/icons';
import { OpenBadge } from '../components/open-badge';
import { OvenBoard } from '../components/oven-board';
import { SiteLink } from '../components/site-link';
import { TimeZoneNote } from '../components/time-zone-note';
import { bakery, formatAddress, groupedHours } from '../content/bakery';
import { allBakes, BADGES, featuredBakes, formatPrice, startingPrice } from '../content/bakes';
import { cakeStartingPrice, featuredCakes } from '../content/cakes';
import { mapDirectionsUrl, mapSearchUrl } from '../lib/maps';
import { absoluteUrl, bakeAnchor, cakeAnchor } from '../lib/paths';
import { bakeryStructuredData, jsonLd } from '../lib/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
};

// Repeated text styles, kept here so every section matches.
const sectionTitle = 'mt-2 text-[clamp(2rem,4.4vw,3.1rem)]';
const lede = 'max-w-(--measure) text-[clamp(1.05rem,1.5vw,1.18rem)] text-muted';
const panel = 'card rounded-panel p-[clamp(1.5rem,3.5vw,2.5rem)] shadow-card';

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(bakeryStructuredData()) }} />

      <section className="overflow-hidden pt-[clamp(2rem,5vw,4rem)] pb-[clamp(2rem,4vw,3rem)]" aria-labelledby="hero-title">
        <div className="wrap grid items-center gap-[clamp(1.5rem,4vw,3.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
          <div>
            <OpenBadge />
            <h1 id="hero-title" className="my-5 grid gap-3">
              <span className="font-wonk text-[clamp(3.3rem,8vw,6.3rem)] leading-[.92] font-semibold tracking-[-.035em]">{bakery.name}</span>
              <span className="font-sans text-[clamp(.95rem,1.4vw,1.1rem)] font-semibold tracking-[.02em] text-accent">{bakery.tagline}</span>
            </h1>
            <p className="max-w-lg text-[clamp(1.1rem,1.7vw,1.26rem)]">{bakery.introduction}</p>
            <p className="mt-7 flex flex-wrap gap-3.5">
              <SiteLink href="/bakes/" className="button">Today’s bakes <Icon name="arrow" width={18} height={18} /></SiteLink>
              <a href="#find-us" className="button button-ghost"><Icon name="pin" width={18} height={18} />Find us</a>
            </p>
            <p className="mt-6 text-[.95rem] text-muted">
              <a href="#find-us" className="inline-flex items-center gap-2 border-b-[1.5px] border-dashed border-line-strong no-underline hover:border-accent hover:text-ink">
                <Icon name="pin" width={18} height={18} className="flex-none text-accent" />{formatAddress()}
              </a>
            </p>
          </div>
          <div className="hero-glow relative mx-auto w-full max-w-xl lg:max-w-none print:hidden">
            <HeroImage />
          </div>
        </div>
      </section>

      <section id="find-us" className="wrap grid gap-6 pt-[clamp(1rem,3vw,2rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]" aria-labelledby="find-us-title">
        <div className={panel}>
          <p className="eyebrow">Find us</p>
          <h2 id="find-us-title" className="mt-3.5 flex items-start gap-2 text-[clamp(1.7rem,3.2vw,2.4rem)]">
            <Icon name="pin" width={22} height={22} className="mt-1.5 flex-none text-accent" />
            <span>
              {bakery.address.street}
              <span className="mt-1 block font-sans text-[1.05rem] font-semibold tracking-normal text-muted">
                {bakery.address.locality}, {bakery.address.region} {bakery.address.postalCode}
              </span>
            </span>
          </h2>
          {bakery.address.note ? <p className="mt-2 text-[.95rem] text-muted">{bakery.address.note}</p> : null}
          <p className="mt-5 mb-1 flex flex-wrap gap-3">
            <a className="button" href={mapDirectionsUrl(formatAddress())} rel="noopener">Get directions <Icon name="arrow" width={18} height={18} /></a>
            <a className="button button-ghost" href={mapSearchUrl(formatAddress())} rel="noopener">Open in Google Maps</a>
          </p>
          {bakery.directions.length ? (
            <ul className="mt-4 grid list-disc gap-1.5 pl-[1.1rem] text-[.95rem] text-muted marker:text-wheat">
              {bakery.directions.map(line => <li key={line}>{line}</li>)}
            </ul>
          ) : null}
          {bakery.notice ? (
            <p className="my-4 flex items-start gap-2 rounded-ui bg-wheat-soft px-4 py-3 text-[.96rem] font-semibold">
              <Icon name="wheat" width={16} height={16} className="mt-1 flex-none text-wheat-ink" />{bakery.notice}
            </p>
          ) : null}
          <h3 className="mt-6 flex items-center gap-2 text-lg"><Icon name="clock" width={18} height={18} className="text-accent" />Opening hours</h3>
          <ul className="mt-2.5 mb-1">
            {groupedHours().map(group => (
              <li key={group.label} className="flex justify-between gap-4 border-b border-dashed border-line-strong py-2">
                <span>{group.label}</span><span className="tabular-nums">{group.hours}</span>
              </li>
            ))}
          </ul>
          <TimeZoneNote />
        </div>
        <GoogleMap className="min-h-96" />
      </section>

      <WheatDivider className="pt-[clamp(3rem,6vw,5rem)]" />

      <section id="oven" className="wrap pt-[clamp(1.5rem,3vw,2.5rem)] pb-[clamp(2rem,4vw,3rem)]" aria-labelledby="oven-title">
        <OvenBoard />
      </section>

      <section id="favourites" className="wrap section-y" aria-labelledby="favourites-title">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="eyebrow">From the racks</p>
            <h2 id="favourites-title" className={sectionTitle}>Neighbourhood favourites</h2>
          </div>
          <SiteLink href="/bakes/" className="text-link">All {allBakes.length} bakes</SiteLink>
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-3">
          {featuredBakes.map(bake => (
            <li key={bake.id} className="drop-shadow-[0_10px_14px_rgba(60,30,10,.16)] transition duration-200 hover:-translate-y-1 hover:-rotate-[.5deg]">
              <SiteLink href={bakeAnchor(bake.id)} className="kraft flex h-full flex-col gap-1.5 px-3.5 pb-5 no-underline sm:px-5 sm:pb-6">
                {bake.badge ? <span className={`sticker sticker-${bake.badge} absolute top-6 right-4 max-sm:hidden`}>{BADGES[bake.badge]}</span> : null}
                <BakeArt art={bake.art} color={bake.color} size={116} className="mt-3 mb-3 self-center max-sm:size-20!" />
                <span className="font-display text-[1.1rem] leading-tight font-semibold sm:text-[1.35rem]">{bake.name}</span>
                <span className="flex-1 text-[.95rem] opacity-80 max-sm:hidden">{bake.description}</span>
                <PriceTag className="mt-auto self-start pt-3">{typeof bake.price === 'number' ? '' : 'from '}{formatPrice(startingPrice(bake))}</PriceTag>
              </SiteLink>
            </li>
          ))}
        </ul>
      </section>

      <section className="section-y scallop-top scallop-bottom relative bg-band [--scallop-fill:var(--bg-band)] [--scallop-line:var(--line)]" aria-labelledby="story-title">
        <div className="wrap grid items-center gap-[clamp(2rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow">The bakery</p>
            <h2 id="story-title" className={sectionTitle}>Slow dough, <em>early mornings</em></h2>
            {bakery.story.map(paragraph => <p key={paragraph} className={`mt-5 ${lede}`}>{paragraph}</p>)}
            <ol className="mt-9 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {bakery.approach.map((point, index) => (
                <li key={point.title} className="flex items-start gap-3.5">
                  <span className="grid size-10 flex-none place-items-center rounded-full border-[1.5px] border-dashed border-wheat font-display text-[1.1rem] font-semibold text-wheat-ink">{index + 1}</span>
                  <span>
                    <strong className="block font-bold">{point.title}</strong>
                    <span className="block text-[.95rem] leading-normal text-muted">{point.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <figure className="card relative rounded-panel p-[clamp(1.5rem,3vw,2.25rem)] shadow-lift">
            <BakedTodayStamp name={bakery.name} className="absolute -top-10 right-2 w-28 sm:-right-4 sm:w-36" />
            <p className="batch-label text-[1.6rem] text-accent">At the counter</p>
            <ul className="mt-4 grid gap-4">
              {bakery.amenities.map(amenity => (
                <li key={amenity.title} className="flex items-start gap-3">
                  <span className="grid size-10 flex-none place-items-center rounded-ui bg-wheat-soft text-wheat-ink"><Icon name={amenity.icon} /></span>
                  <span>
                    <strong className="block font-bold">{amenity.title}</strong>
                    <span className="block text-[.95rem] leading-normal text-muted">{amenity.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <figcaption className="mt-5 border-t border-dashed border-line-strong pt-4 text-[.95rem] text-muted">
              Want a loaf held for you? <SiteLink href="/contact/" className="text-link">Send us a note</SiteLink> the day before.
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="cakes" className="wrap pt-(--space-section)" aria-labelledby="cakes-title">
        <div className={`${panel} grid items-center gap-x-10 gap-y-6 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]
          [background:radial-gradient(28rem_18rem_at_100%_0%,color-mix(in_srgb,var(--wheat)_22%,transparent),transparent_70%),radial-gradient(22rem_16rem_at_0%_100%,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_70%),var(--surface)]`}>
          <div>
            <p className="eyebrow">Celebration cakes</p>
            <h2 id="cakes-title" className="mt-2 mb-3 text-[clamp(1.9rem,3.6vw,2.7rem)]">Birthdays, weddings &amp; <em>just because</em></h2>
            <p className="text-muted">
              Layered cakes made to order with the same butter, flour and fruit as our pastries. Tell us the date and how many
              people — we’ll reply to confirm price and availability.
            </p>
            <p className="mt-6 flex flex-wrap gap-3">
              <SiteLink href="/cakes/" className="button">See the cakes <Icon name="arrow" width={18} height={18} /></SiteLink>
              <SiteLink href="/contact/" className="button button-ghost">Ask about a cake</SiteLink>
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {featuredCakes.map((cake, index) => (
              <li key={cake.id} className={index === 2 ? 'max-sm:hidden' : ''}>
                <SiteLink href={cakeAnchor(cake.id)} className="group grid justify-items-center gap-2 text-center no-underline">
                  <CakeArt cake={cake} idPrefix="home" className="max-w-48 transition duration-200 group-hover:-translate-y-1" />
                  <span className="font-display text-[1.05rem] leading-tight font-semibold group-hover:text-accent">{cake.name}</span>
                  <span className="text-[.88rem] text-muted">from {formatPrice(cakeStartingPrice(cake))}</span>
                </SiteLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {bakery.faqs.length ? (
        <section id="faq" className="wrap section-y" aria-labelledby="faq-title">
          <p className="eyebrow">FAQs</p>
          <h2 id="faq-title" className={sectionTitle}>Good to know</h2>
          <div className="mt-6 grid max-w-[52rem] gap-3">
            {bakery.faqs.map(faq => (
              <details key={faq.question} className="faq card">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[1.05rem] font-bold">{faq.question}</summary>
                <p className="max-w-(--measure) px-5 pb-5 text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-muted">
            Something else? <SiteLink href="/contact/" className="text-link">Send us a note</SiteLink>
            {bakery.phone ? <> or call <a className="text-link" href={`tel:${bakery.phone.replace(/[^\d+]/g, '')}`}>{bakery.phone}</a></> : null}.
          </p>
        </section>
      ) : null}
    </>
  );
}
