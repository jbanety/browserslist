import browserslist from '../';

import test from 'ava';
import path from 'path';
import fs   from 'fs';

const usage = path.join(__dirname, 'fixtures', 'stats.json');

test.afterEach(() => {
    delete process.env.BROWSERSLIST_STATS;
});

test('throws error on invalid file', t => {
    t.throws(() => {
        browserslist('', { stats: 'no.json' });
    }, 'Can\'t read no.json');
});

test.serial('takes stats file from environment variable', t => {
    process.env.BROWSERSLIST_STATS = usage;
    t.same(browserslist('> 10% in my stats'), ['ie 11']);
});

test('takes stats by path', t => {
    t.same(browserslist('> 10% in my stats', { stats: usage }), ['ie 11']);
});

test('take stats from usage data object', t => {
    const data = JSON.parse(fs.readFileSync(usage));
    t.same(browserslist('> 10% in my stats', { stats: data }), ['ie 11']);
});

test('works alongside global usage query', t => {
    t.ok(browserslist('> 10% in my stats, > 1%', { stats: usage }).length > 1);
});
