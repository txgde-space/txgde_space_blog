'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync(require.resolve('../source/js/site-counter.js'), 'utf8');

test('local and deployment previews never access the counter or DOM', () => {
  for (const origin of ['http://localhost:4000', 'http://127.0.0.1:4000', 'https://preview.vercel.app', 'https://blog.txgde.space.evil.example', 'http://blog.txgde.space', 'https://blog.txgde.space:4000']) {
    vm.runInNewContext(code, { window: { location: { origin } } });
  }
});

test('production loads asynchronously and replaces the loader on navigation', () => {
  const scripts = [];
  const document = {
    createElement: () => ({ dataset: {}, remove() { scripts.splice(scripts.indexOf(this), 1); } }),
    querySelectorAll: () => [...scripts],
    body: { appendChild: script => scripts.push(script) }
  };
  const context = { window: { location: { origin: 'https://blog.txgde.space' } }, document };
  vm.runInNewContext(code, context);
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, 'https://cn.vercount.one/js');
  assert.equal(scripts[0].async, true);
  const first = scripts[0];
  vm.runInNewContext(code, context);
  assert.equal(scripts.length, 1);
  assert.notEqual(scripts[0], first);
});
