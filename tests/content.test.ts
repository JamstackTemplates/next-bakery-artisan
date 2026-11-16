// Content invariants for the bakery, its bakes and cakes. Runs with Node's built-in TypeScript type stripping.
// When one of these fails after an edit, the message names the bake, cake or day to fix.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { bakery, DAYS, formatAddress, formatTime, groupedHours, openDaysLabel, openState, publicLinks, toMinutes } from '../content/bakery.ts';
import { allBakes, ARTS, BADGES, bakeDaysLabel, bakes, DIETS, featuredBakes, formatPrice, startingPrice } from '../content/bakes.ts';
import { cakes, featuredCakes, howItWorks } from '../content/cakes.ts';
import { matchesAll, matchesFilter, visibleCounts } from '../lib/bake-filter.ts';
import { timeZoneLabel } from '../lib/time-zone.ts';
import { mapDirectionsUrl, mapEmbedUrl, mapSearchUrl } from '../lib/maps.ts';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const validPrice = (amount: number) => Number.isFinite(amount) && amount > 0 && Math.round(amount * 100) === amount * 100;

test('sections, bakes and cakes have unique, URL-safe ids', () => {
  assert.ok(bakes.sections.length >= 1, 'Add at least one bake section.');
  const ids = [...bakes.sections.map(section => section.id), ...allBakes.map(bake => bake.id), ...cakes.map(cake => cake.id)];
  for (const id of ids) assert.match(id, SLUG, `"${id}" must be lowercase words joined by hyphens`);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(duplicates, [], `ids must be unique across sections, bakes and cakes: ${duplicates.join(', ')}`);
  // Page sections on /bakes/ and / that bake ids must not collide with.
  for (const reserved of ['main', 'find-us', 'oven', 'faq', 'favourites', 'cakes', 'how-it-works']) {
    assert.ok(!ids.includes(reserved), `"${reserved}" is used by the page itself; choose another id`);
  }
});

test('every section and bake is complete', () => {
  for (const section of bakes.sections) {
    assert.ok(section.title.trim() && section.description.trim(), `section ${section.id} needs a title and description`);
    assert.ok(section.bakes.length >= 1, `section ${section.id} has no bakes`);
  }
  for (const bake of allBakes) {
    assert.ok(bake.name.trim(), `${bake.id}.name`);
    assert.ok(bake.description.trim(), `${bake.id}.description`);
    assert.ok(ARTS.includes(bake.art), `${bake.id}.art must be one of ${ARTS.join(', ')}`);
    assert.ok(bake.color.trim(), `${bake.id}.color`);
    for (const diet of bake.diet ?? []) assert.ok(diet in DIETS, `${bake.id} has unknown diet "${diet}"`);
    assert.equal(new Set(bake.diet).size, bake.diet?.length ?? 0, `${bake.id} repeats a diet tag`);
    assert.ok(!(bake.diet?.includes('vegan') && bake.diet.includes('vegetarian')), `${bake.id}: vegan already implies vegetarian; keep just "vegan"`);
    if (bake.badge) assert.ok(bake.badge in BADGES, `${bake.id} has unknown badge "${bake.badge}"`);
    if (bake.badge === 'weekend') assert.ok(bake.days?.length, `${bake.id} has the weekend badge, so list the days it's baked`);
  }
});

test('prices are positive with at most two decimals, and sizes are labelled', () => {
  for (const bake of allBakes) {
    if (typeof bake.price === 'number') {
      assert.ok(validPrice(bake.price), `${bake.id} price ${bake.price}`);
    } else {
      assert.ok(bake.price.length >= 1, `${bake.id} needs at least one size`);
      for (const size of bake.price) {
        assert.ok(size.label.trim(), `${bake.id} size label`);
        assert.ok(validPrice(size.amount), `${bake.id} ${size.label} price ${size.amount}`);
      }
      assert.equal(new Set(bake.price.map(size => size.label)).size, bake.price.length, `${bake.id} repeats a size`);
    }
  }
});

test('prices format in the bakes currency', () => {
  assert.equal(formatPrice(4.5), '$4.50');
  assert.equal(formatPrice(4), '$4');
  assert.equal(formatPrice(0), 'Free');
  assert.equal(startingPrice({ ...allBakes[0], price: [{ label: 'Whole', amount: 9 }, { label: 'Half', amount: 5 }] }), 5);
  assert.doesNotThrow(() => new Intl.NumberFormat(bakes.locale, { style: 'currency', currency: bakes.currency }));
});

test('oven times are valid and fall within opening hours on every day the bake is made', () => {
  for (const bake of allBakes) {
    assert.ok(bake.ovenTimes.length >= 1, `${bake.id} needs at least one oven time, e.g. ovenTimes: ['07:00']`);
    assert.equal(new Set(bake.ovenTimes).size, bake.ovenTimes.length, `${bake.id} repeats an oven time`);
    for (const time of bake.ovenTimes) assert.match(time, TIME, `${bake.id} oven time "${time}" must be 24-hour HH:MM`);
    for (const day of bake.days ?? []) {
      assert.ok(DAYS.includes(day), `${bake.id} has unknown day "${day}"`);
      const hours = bakery.hours.find(entry => entry.day === day);
      assert.ok(hours?.opens, `${bake.id} is baked on ${day}, but the bakery is closed on ${day}`);
    }
    assert.equal(new Set(bake.days).size, bake.days?.length ?? 0, `${bake.id} repeats a day`);
    const bakedDays = bake.days?.length ? bake.days : DAYS.filter(day => bakery.hours.some(entry => entry.day === day && entry.opens));
    for (const day of bakedDays) {
      const hours = bakery.hours.find(entry => entry.day === day)!;
      for (const time of bake.ovenTimes) {
        assert.ok(toMinutes(time) >= toMinutes(hours.opens!) && toMinutes(time) < toMinutes(hours.closes!),
          `${bake.id} comes out at ${time} on ${day}, outside that day's hours (${hours.opens}–${hours.closes})`);
      }
    }
  }
});

test('day labels read naturally', () => {
  assert.equal(bakeDaysLabel({}), '');
  assert.equal(bakeDaysLabel({ days: ['Saturday'] }), 'Saturdays only');
  assert.equal(bakeDaysLabel({ days: ['Saturday', 'Sunday'] }), 'Weekends only');
  assert.equal(bakeDaysLabel({ days: ['Friday', 'Saturday', 'Sunday'] }), 'Fri, Sat & Sun only');
});

test('the sample content shows every state the board supports', () => {
  assert.ok(allBakes.length >= 18 && allBakes.length <= 24, `Keep 18–24 sample bakes (now ${allBakes.length})`);
  assert.ok(featuredBakes.length >= 4 && featuredBakes.length <= 6, 'Mark 4–6 bakes with featured: true');
  assert.ok(allBakes.some(bake => bake.soldOut), 'at least one sample bake is sold out');
  assert.ok(allBakes.some(bake => bake.days?.length), 'at least one sample bake is weekend-only');
  assert.ok(allBakes.some(bake => bake.diet?.includes('vegan')), 'at least one sample bake is vegan');
});

test('celebration cakes are complete, with positive sizes, prices and notice', () => {
  assert.ok(cakes.length >= 1, 'Add at least one cake.');
  for (const cake of cakes) {
    assert.ok(cake.name.trim() && cake.description.trim(), `${cake.id} needs a name and description`);
    for (const key of ['sponge', 'filling', 'frosting'] as const) assert.ok(cake.flavours[key].trim(), `${cake.id}.flavours.${key}`);
    for (const key of ['sponge', 'filling', 'frosting', 'decoration'] as const) assert.ok(cake.colors[key].trim(), `${cake.id}.colors.${key}`);
    assert.ok(['frosted', 'naked', 'drip'].includes(cake.style), `${cake.id}.style`);
    assert.ok([1, 2, 3].includes(cake.tiers), `${cake.id}.tiers must be 1, 2 or 3`);
    assert.ok(cake.sizes.length >= 1, `${cake.id} needs at least one size`);
    for (const size of cake.sizes) {
      assert.ok(size.diameter > 0, `${cake.id} size diameter ${size.diameter}`);
      assert.ok(Number.isInteger(size.servings) && size.servings > 0, `${cake.id} ${size.diameter}" servings ${size.servings}`);
      assert.ok(validPrice(size.price), `${cake.id} ${size.diameter}" price ${size.price}`);
    }
    assert.ok(Number.isInteger(cake.leadDays) && cake.leadDays >= 1, `${cake.id}.leadDays must be a whole number of days, at least 1`);
  }
  assert.ok(featuredCakes.length >= 2 && featuredCakes.length <= 3, 'Mark 2–3 cakes with featured: true');
  assert.ok(howItWorks.length >= 3 && howItWorks.length <= 4, 'Keep 3–4 "how it works" steps');
  for (const step of howItWorks) assert.ok(step.title.trim() && step.detail.trim(), `how it works: "${step.title}"`);
});

test('opening hours list each day once with valid times', () => {
  assert.deepEqual(bakery.hours.map(entry => entry.day), [...DAYS]);
  for (const entry of bakery.hours) {
    assert.equal(Boolean(entry.opens), Boolean(entry.closes), `${entry.day}: set both opens and closes, or neither`);
    if (entry.opens && entry.closes) {
      assert.match(entry.opens, TIME, `${entry.day}.opens`);
      assert.match(entry.closes, TIME, `${entry.day}.closes`);
      assert.ok(toMinutes(entry.opens) < toMinutes(entry.closes), `${entry.day} must open before it closes`);
    }
  }
});

test('hours format and group for people', () => {
  assert.equal(formatTime('07:00'), '7am');
  assert.equal(formatTime('07:30'), '7:30am');
  assert.equal(formatTime('12:00'), '12pm');
  assert.equal(formatTime('15:15'), '3:15pm');
  assert.equal(formatTime('00:00'), '12am');
  const groups = groupedHours([
    { day: 'Monday' }, { day: 'Tuesday', opens: '07:00', closes: '15:00' },
    { day: 'Wednesday', opens: '07:00', closes: '15:00' }, { day: 'Thursday', opens: '07:00', closes: '16:00' },
  ]);
  assert.deepEqual(groups, [
    { label: 'Monday', hours: 'Closed' }, { label: 'Tue – Wed', hours: '7am – 3pm' }, { label: 'Thursday', hours: '7am – 4pm' },
  ]);
  assert.equal(openDaysLabel(), 'Tue – Sun');
  assert.equal(openDaysLabel(DAYS.map(day => ({ day, opens: '07:00', closes: '15:00' }))), 'Every day');
  assert.equal(openDaysLabel([{ day: 'Tuesday', opens: '07:00', closes: '15:00' }, { day: 'Thursday', opens: '07:00', closes: '15:00' }, { day: 'Friday', opens: '07:00', closes: '15:00' }]), 'Tue, Thu – Fri');
});

test('open-now logic handles open, before opening, after closing and closed days', () => {
  const list = [
    { day: 'Monday' as const }, { day: 'Tuesday' as const, opens: '07:00', closes: '15:00' },
    { day: 'Wednesday' as const, opens: '08:00', closes: '12:00' },
  ];
  assert.deepEqual(openState('Tuesday', toMinutes('09:00'), list), { open: true, closes: '15:00' });
  assert.deepEqual(openState('Tuesday', toMinutes('06:59'), list), { open: false, next: { day: 'Tuesday', opens: '07:00' } });
  assert.deepEqual(openState('Tuesday', toMinutes('15:00'), list), { open: false, next: { day: 'Wednesday', opens: '08:00' } });
  assert.deepEqual(openState('Monday', toMinutes('10:00'), list), { open: false, next: { day: 'Tuesday', opens: '07:00' } });
  assert.deepEqual(openState('Wednesday', toMinutes('13:00'), list), { open: false, next: { day: 'Tuesday', opens: '07:00' } });
  assert.deepEqual(openState('Monday', 600, []), { open: false });
});

test('dietary filters: vegan implies vegetarian; "no nuts" hides nut bakes', () => {
  const base = allBakes[0];
  const vegan = { ...base, diet: ['vegan' as const] };
  const nuts = { ...base, diet: ['vegetarian' as const, 'contains-nuts' as const] };
  assert.ok(matchesFilter(vegan, 'vegetarian') && matchesFilter(vegan, 'nut-free'));
  assert.ok(!matchesFilter(nuts, 'nut-free') && !matchesFilter(nuts, 'vegan'));
  assert.ok(matchesAll(vegan, []));
  assert.ok(!matchesAll(nuts, ['vegetarian', 'nut-free']));
  const counts = visibleCounts(bakes.sections, []);
  assert.equal(Object.values(counts).reduce((a, b) => a + b, 0), allBakes.length);
});

test('contact details and links are publishable', () => {
  assert.match(bakery.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  for (const link of publicLinks) assert.match(link.url, /^https:\/\//, link.url);
  assert.ok(bakery.amenities.length >= 1 && bakery.faqs.length >= 1);
  assert.ok(bakery.approach.length >= 3 && bakery.approach.length <= 4, 'Keep 3–4 approach points');
  assert.ok(existsSync(new URL('../public/og.png', import.meta.url)), 'public/og.png social image');
});

test('time zones read naturally next to the hours', () => {
  assert.equal(timeZoneLabel('America/Los_Angeles'), 'Pacific Time');
  assert.equal(timeZoneLabel('America/New_York'), 'Eastern Time');
  assert.equal(timeZoneLabel('UTC'), 'UTC');
  assert.equal(timeZoneLabel(''), '');
  assert.ok(timeZoneLabel('Asia/Kolkata').length > 0);
});

test('the address is complete and Google Maps links are keyless and encoded', () => {
  for (const key of ['street', 'locality', 'region', 'postalCode', 'country'] as const) assert.ok(bakery.address[key].trim(), `address.${key}`);
  assert.match(bakery.address.country, /^[A-Z]{2}$/);
  const query = formatAddress();
  assert.equal(query, '333 Post St, San Francisco, CA 94108');
  assert.equal(mapSearchUrl('A & B, #1'), 'https://www.google.com/maps/search/?api=1&query=A%20%26%20B%2C%20%231');
  assert.ok(mapDirectionsUrl(query).startsWith('https://www.google.com/maps/dir/?api=1&destination=333%20Post%20St'));
  assert.equal(mapEmbedUrl(query), 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s333+Post+St%2C+San+Francisco%2C+CA+94108!6i16');
  assert.ok(mapEmbedUrl('Shop! 1').includes('1sShop%21+1!6i16'));
  for (const url of [mapSearchUrl(query), mapDirectionsUrl(query), mapEmbedUrl(query)]) assert.doesNotMatch(url, /key=/);
});
