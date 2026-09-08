'use strict';

// Run after npm run build. Network-dependent auditing is deliberately separate
// from deployment checks: an unavailable image host should not block publishing.
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('cheerio');
const root = path.resolve(__dirname, '..');
const posts = JSON.parse(fs.readFileSync(path.join(root, 'db.json'))).models.Post;
const images = new Map();
for (const post of posts) {
  const $ = load(post.content);
  $('img').each((_, img) => {
    const url = $(img).attr('data-src') || $(img).attr('src');
    if (!url || !/^https?:\/\//i.test(url)) return;
    if (!images.has(url)) images.set(url, { url, articles: [] });
    const articles = images.get(url).articles;
    if (!articles.includes(post.source)) articles.push(post.source);
  });
}

async function probe(url, method) {
  const response = await fetch(url, {
    method,
    headers: { Referer: 'https://blog.txgde.space/', ...(method === 'GET' ? { Range: 'bytes=0-1023' } : {}) },
    signal: AbortSignal.timeout(15000)
  });
  const result = { status: response.status, type: response.headers.get('content-type') || '', finalUrl: response.url };
  if (response.body) await response.body.cancel();
  return result;
}

async function main() {
  const queue = [...images.values()];
  let cursor = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (cursor < queue.length) {
      const item = queue[cursor++];
      try {
        let result = await probe(item.url, 'HEAD');
        if (result.status >= 400 || !result.type.startsWith('image/')) result = await probe(item.url, 'GET');
        Object.assign(item, result);
        item.ok = result.status >= 200 && result.status < 300 && result.type.startsWith('image/');
      } catch (error) {
        item.ok = false;
        item.error = error.cause?.code || error.message;
      }
    }
  }));
  const report = { checkedAt: new Date().toISOString(), total: queue.length, ok: queue.filter(x => x.ok).length, images: queue };
  const output = path.resolve(process.argv[2] || '/tmp/blog-image-audit.json');
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  console.log(`Checked ${report.total} unique image URLs: ${report.ok} image responses, ${report.total - report.ok} need review. Report: ${output}`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
