'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { prepareSearchModule } = require('../lib/search-module.cjs');
const source = fs.readFileSync(require.resolve('hexo-theme-redefine/source/js/tools/localSearch.js'), 'utf8');

test('lazy search waits for user action and renders text entered during a slow fetch', async () => {
  let resolveFetch;
  let requests = 0;
  const input = { value: 'MongoDB', focus() {} };
  const result = { innerHTML: '' };
  const elements = { '.search-input': input, '#search-result': result, '.search-pop-overlay': { classList: { add() {}, remove() {} } } };
  const context = vm.createContext({
    config: { path: 'search.json', root: '/' }, theme: { navbar: { search: { preload: false } } },
    document: { body: { style: {} }, querySelector: s => elements[s], getElementById: id => elements['#' + id] },
    window: {}, setTimeout() {}, console,
    fetch: () => { requests++; return new Promise(resolve => { resolveFetch = resolve; }); }
  });
  vm.runInContext(prepareSearchModule(source).replace(/export /g, ''), context);
  vm.runInContext('initLocalSearchPage()', context);
  assert.equal(requests, 0);
  vm.runInContext('openPopup(); openPopup()', context);
  assert.equal(requests, 1);
  resolveFetch({ ok: true, text: async () => JSON.stringify([{ title: 'MongoDB 笔记', content: '数据库', url: '/mongodb/' }]) });
  await new Promise(resolve => setImmediate(resolve));
  assert.ok(result.innerHTML.includes('/mongodb/'));
  vm.runInContext('openPopup()', context);
  assert.equal(requests, 1, 'Subsequent searches reuse the index');
});
