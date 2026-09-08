'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('cheerio');
const legacyPosts = require('../test/fixtures/legacy-posts.json');
const site = new URL('https://blog.txgde.space');
const root = path.resolve(__dirname, '../public');

function read(file) {
  assert.ok(fs.existsSync(path.join(root, file)), `Missing generated page: ${file}`);
  return load(fs.readFileSync(path.join(root, file), 'utf8'));
}

// These URLs were captured from the live repository before migration.
for (const { path: file, title } of legacyPosts) {
  const $ = read(file);
  assert.equal($('meta[property="og:title"]').attr('content'), title, `Changed title: ${file}`);
  const canonical = $('link[rel="canonical"]').attr('href') || $('meta[property="og:url"]').attr('content');
  assert.equal(new URL(canonical).origin, site.origin, `Wrong canonical origin: ${file}`);
  assert.equal(decodeURIComponent(new URL(canonical).pathname), '/' + file.replace(/index\.html$/, ''), `Changed permalink: ${file}`);
}

const sourcePosts = fs.readdirSync(path.join(__dirname, '../source/_posts')).filter(file => file.endsWith('.md'));
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8')).models.Post;
for (const post of posts) {
  assert.ok(post.description?.trim(), `Missing article description: ${post.source}`);
  const $ = read(legacyPosts.find(item => item.title === post.title).path);
  assert.equal($('meta[property="og:description"]').attr('content'), post.description, `Wrong share description: ${post.source}`);
  assert.equal($('meta[name="description"]').attr('content'), post.description, `Wrong page description: ${post.source}`);
}
const feed = load(fs.readFileSync(path.join(root, 'rss.xml'), 'utf8'), { xml: true });
assert.equal(feed('rss').attr('version'), '2.0');
assert.equal(feed('item').length, sourcePosts.length, 'RSS must cover every published article');
feed('item').each((_, item) => {
  const link = feed(item).children('link').text();
  const legacy = legacyPosts.find(post => decodeURIComponent(new URL(link).pathname) === '/' + post.path.replace(/index\.html$/, ''));
  const post = posts.find(post => post.title === legacy?.title);
  assert.ok(post, `Unknown RSS permalink: ${link}`);
  assert.equal(feed(item).children('description').text(), post.description);
});
assert.equal(read('index.html')('link[rel="alternate"][type="application/rss+xml"]').attr('href'), '/rss.xml');
assert.ok(read('index.html').html().includes('"preload":false'), 'Search should load only when requested');
assert.ok(fs.readFileSync(path.join(root, 'js/build/tools/localSearch.js'), 'utf8').includes('if (input?.value.trim()) renderSearchResult(input);'), 'Lazy search must refresh a query entered during loading');
const hiddenPreviews = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8')).models.Post
  .filter(post => post.excerpt === 'false').map(post => post.title));
assert.ok(!read('index.html').html().includes('you@example.com'), 'Theme example email leaked into site');
const search = JSON.parse(fs.readFileSync(path.join(root, 'search.json'), 'utf8'));
assert.equal(search.length, sourcePosts.length, 'Search index must cover every article');
assert.ok(search.some(post => post.title.includes('broadcastMAC_example')), 'Latest article is not searchable');

let cards = 0;
for (let page = 1; ; page++) {
  const file = page === 1 ? 'index.html' : `page/${page}/index.html`;
  if (!fs.existsSync(path.join(root, file))) break;
  const $ = read(file);
  $('.home-article-item').each((_, card) => {
    const text = $(card).find('.home-article-content').text().trim();
    const title = $(card).find('.home-article-title').text().trim();
    assert.ok(text.length > 0 || hiddenPreviews.has(title), 'Unexpected empty article preview');
    assert.ok(!text.includes('123456789101112'), 'Code line numbers leaked into preview');
    assert.equal($(card).find('.home-article-content pre, .home-article-content .gutter').length, 0);
    cards++;
  });
}
assert.equal(cards, sourcePosts.length, 'Pagination must include every article');

const latest = legacyPosts.find(post => post.title.includes('broadcastMAC_example'));
const article = read(latest.path);
assert.ok(article('figure.highlight .gutter').length > 0, 'Article code line numbers were lost');
assert.ok(article('figure.highlight .code').text().includes('NS_LOG_COMPONENT_DEFINE'), 'Article code was lost');

for (const file of ['archives/index.html', 'tags/index.html', 'categories/index.html', '404.html']) read(file);

// Check navigation and assets across all HTML pages without fetching external sites.
let pages = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(file); continue; }
    if (!file.endsWith('.html')) continue;
    pages++;
    const $ = load(fs.readFileSync(file, 'utf8'));
    assert.equal($('script[src*="vercount.one"]').length, 0, 'Counter must use the origin-checked loader');
    assert.equal($('script[src="/js/site-counter.js"]').length, 1);
    assert.ok($('script[src="/js/site-counter.js"]').is('[data-swup-reload-script]'), 'Counter must reload after Swup navigation');
    $('[id^="busuanzi_container_"]').each((_, node) => {
      assert.equal($(node).attr('style'), 'display: none !important;', 'Counter labels must start hidden');
    });
    if (!$('.essay-date').length) assert.equal($('script[src$="/moment-with-locales.min.js"]').length, 0);
    const base = new URL('/' + path.relative(root, file), site);
    $('a[href], link[href], script[src], img[src], img[data-src]').each((_, node) => {
      const element = $(node);
      const value = element.attr('data-src') || element.attr('src') || element.attr('href');
      if (!value || value.startsWith('#')) return;
      const url = new URL(value.trim(), base);
      if (url.origin !== site.origin) return;
      const target = path.join(root, decodeURIComponent(url.pathname));
      const exists = fs.existsSync(target) && (fs.statSync(target).isFile() || fs.existsSync(path.join(target, 'index.html')));
      assert.ok(exists, `Broken local URL in ${path.relative(root, file)}: ${value}`);
    });
  }
}
walk(root);
console.log(`Checked ${legacyPosts.length} legacy URLs, ${cards} previews, ${search.length} search entries and local links/assets in ${pages} HTML pages.`);
