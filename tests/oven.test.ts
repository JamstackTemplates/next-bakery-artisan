// "Out of the oven" board logic: what the home page says at a given local day and time.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Bake } from '../content/bakes.ts';
import type { OpeningHours } from '../content/bakery.ts';
import { allBakes } from '../content/bakes.ts';
import { bakery, toMinutes } from '../content/bakery.ts';
import { localNow } from '../lib/local-time.ts';
import { bakedOn, JUST_OUT_MINUTES, ovenSchedule, ovenToday } from '../lib/oven.ts';

const bake = (id: string, ovenTimes: string[], extra: Partial<Bake> = {}): Bake =>
  ({ id, name: id, description: id, price: 1, art: 'boule', color: '#a60', ovenTimes, ...extra });

const loaf = bake('loaf', ['07:00', '11:30']);
const croissant = bake('croissant', ['07:00', '10:00']);
const rye = bake('rye', ['08:00'], { days: ['Saturday'] });
const almond = bake('almond', ['08:30'], { soldOut: true });
const sample = [loaf, croissant, rye, almond];

const hours: OpeningHours[] = [
  { day: 'Monday' },
  { day: 'Tuesday', opens: '07:00', closes: '15:00' },
  { day: 'Wednesday', opens: '07:00', closes: '15:00' },
  { day: 'Thursday', opens: '07:00', closes: '15:00' },
  { day: 'Friday', opens: '07:00', closes: '15:00' },
  { day: 'Saturday', opens: '07:00', closes: '16:00' },
  { day: 'Sunday', opens: '07:00', closes: '13:00' },
];

const at = (time: string) => toMinutes(time);
const ids = (bakes: Bake[]) => bakes.map(item => item.id);

test('the static schedule groups every bake by time, earliest first', () => {
  const schedule = ovenSchedule(sample);
  assert.deepEqual(schedule.map(batch => batch.time), ['07:00', '08:00', '08:30', '10:00', '11:30']);
  assert.deepEqual(ids(schedule[0].bakes), ['loaf', 'croissant']);
  assert.deepEqual(ids(schedule[1].bakes), ['rye'], 'weekend-only bakes are listed in the day-neutral schedule');
  const all = ovenSchedule(allBakes);
  assert.ok(all.every((batch, index) => index === 0 || toMinutes(all[index - 1].time) < toMinutes(batch.time)));
});

test('weekend-only bakes appear only on their days', () => {
  assert.ok(!bakedOn(rye, 'Tuesday') && bakedOn(rye, 'Saturday') && bakedOn(loaf, 'Tuesday'));
  assert.deepEqual(ovenSchedule(sample, 'Tuesday').map(batch => batch.time), ['07:00', '08:30', '10:00', '11:30']);
  assert.deepEqual(ovenSchedule(sample, 'Saturday').map(batch => batch.time), ['07:00', '08:00', '08:30', '10:00', '11:30']);
});

test('before opening: everything is still to come and the first batch is next', () => {
  const board = ovenToday(sample, hours, 'Tuesday', at('06:15'));
  assert.equal(board.phase, 'before-opening');
  assert.equal(board.isToday, true);
  assert.equal(board.next, '07:00');
  assert.deepEqual(board.batches.map(batch => batch.state), ['next', 'later', 'later', 'later']);
  assert.deepEqual(board.justOut, []);
});

test('between batches: recent batches are just out, older ones out, and the next is flagged', () => {
  const board = ovenToday(sample, hours, 'Tuesday', at('10:20'));
  assert.equal(board.phase, 'baking');
  assert.equal(board.next, '11:30');
  assert.deepEqual(board.batches.map(batch => [batch.time, batch.state]), [
    ['07:00', 'out'], ['08:30', 'out'], ['10:00', 'just-out'], ['11:30', 'next'],
  ]);
  assert.deepEqual(ids(board.justOut), ['croissant']);
  const later = ovenToday(sample, hours, 'Tuesday', at('10:00') + JUST_OUT_MINUTES);
  assert.equal(later.batches.find(batch => batch.time === '10:00')?.state, 'out');
});

test('sold-out bakes are never "just out" and never make a batch "next"', () => {
  const board = ovenToday(sample, hours, 'Tuesday', at('08:40'));
  assert.equal(board.batches.find(batch => batch.time === '08:30')?.state, 'just-out');
  assert.deepEqual(ids(board.justOut), [], 'the almond croissant batch is out, but it is sold out');
  const early = ovenToday(sample, hours, 'Tuesday', at('08:00'));
  assert.equal(early.next, '10:00', 'the 8:30 batch only has sold-out bakes, so the next batch worth waiting for is 10am');
  assert.equal(early.batches.find(batch => batch.time === '08:30')?.state, 'later');
});

test('weekend-only bakes join the board on their day', () => {
  const board = ovenToday(sample, hours, 'Saturday', at('08:10'));
  assert.deepEqual(ids(board.justOut), ['rye']);
  assert.equal(board.next, '10:00');
});

test('after the last batch: everything is out until closing', () => {
  const board = ovenToday(sample, hours, 'Tuesday', at('14:00'));
  assert.equal(board.phase, 'after-last-batch');
  assert.equal(board.next, undefined);
  assert.ok(board.batches.every(batch => batch.state === 'out'));
});

test('closed days and after closing show the next opening day’s schedule', () => {
  const monday = ovenToday(sample, hours, 'Monday', at('09:00'));
  assert.equal(monday.phase, 'closed');
  assert.equal(monday.isToday, false);
  assert.equal(monday.day, 'Tuesday');
  assert.equal(monday.opens, '07:00');
  assert.ok(monday.batches.every(batch => batch.state === 'later'));
  assert.deepEqual(monday.justOut, []);

  const friday = ovenToday(sample, hours, 'Friday', at('15:00'));
  assert.equal(friday.phase, 'closed');
  assert.equal(friday.day, 'Saturday');
  assert.ok(friday.batches.some(batch => batch.bakes.includes(rye)), 'Saturday’s board includes the rye');

  const sunday = ovenToday(sample, hours, 'Sunday', at('13:30'));
  assert.equal(sunday.day, 'Tuesday', 'Sunday after close skips closed Monday');

  const never = ovenToday(sample, [], 'Tuesday', at('09:00'));
  assert.equal(never.phase, 'closed');
  assert.deepEqual(never.batches, []);
});

test('the sample bakery always has something on the board', () => {
  for (const entry of bakery.hours.filter(item => item.opens)) {
    assert.ok(ovenSchedule(allBakes, entry.day).length > 0, `${entry.day} has no oven times`);
  }
});

test('local time is read in the bakery’s time zone, not the device’s', () => {
  // 2026-01-06 18:30 UTC is Tuesday 10:30 in San Francisco and Wednesday 03:30 in Tokyo.
  const instant = new Date(Date.UTC(2026, 0, 6, 18, 30));
  assert.deepEqual(localNow('America/Los_Angeles', instant), { day: 'Tuesday', minutes: 630 });
  assert.deepEqual(localNow('Asia/Tokyo', instant), { day: 'Wednesday', minutes: 210 });
});
