import { bakery } from '../content/bakery';
import { bakes } from '../content/bakes';
import { absoluteUrl } from './paths';

const SCHEMA_DAYS = { Monday: 'Mo', Tuesday: 'Tu', Wednesday: 'We', Thursday: 'Th', Friday: 'Fr', Saturday: 'Sa', Sunday: 'Su' } as const;

/** schema.org Bakery for search engines and maps. Built from the same content as the pages. */
export function bakeryStructuredData() {
  const url = absoluteUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: bakery.name,
    description: bakery.introduction,
    ...(url ? { url, hasMenu: absoluteUrl('/bakes/') } : {}),
    email: bakery.email,
    ...(bakery.phone ? { telephone: bakery.phone } : {}),
    servesCuisine: ['Bakery', 'Sourdough bread', 'Pastries', 'Cakes'],
    priceRange: '$',
    currenciesAccepted: bakes.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: bakery.address.street,
      addressLocality: bakery.address.locality,
      addressRegion: bakery.address.region,
      postalCode: bakery.address.postalCode,
      addressCountry: bakery.address.country,
    },
    openingHours: bakery.hours.filter(entry => entry.opens && entry.closes)
      .map(entry => `${SCHEMA_DAYS[entry.day]} ${entry.opens}-${entry.closes}`),
    sameAs: bakery.links.filter(link => link.url.trim()).map(link => link.url),
  };
}

/** JSON for an inline <script type="application/ld+json">, safe against closing the script tag. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
