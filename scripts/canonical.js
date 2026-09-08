'use strict';

// Upstream lowercases canonical paths. Vercel paths are case-sensitive, so an
// article such as [CTFHub]Re2Shellcode would otherwise advertise a missing URL.
// Register after theme loading so package upgrades cannot replace this helper.
hexo.on('ready', () => {
  hexo.extend.helper.register('autoCanonical', function (config, page) {
    const route = String(page.canonical_path || page.path || '').replace(/index\.html$/, '');
    const url = new URL(route, config.url.replace(/\/?$/, '/')).href;
    const escaped = url.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return `<link rel="canonical" href="${escaped}"/>`;
  });
});
