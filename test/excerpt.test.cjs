'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { applyExcerpt, plainText } = require('../lib/excerpt.cjs');

test('long code at the beginning does not turn the preview into line numbers', () => {
  const numbers = Array.from({ length: 150 }, (_, i) => `<span class="line">${i + 1}</span>`).join('');
  const content = `<div class="code-container"><figure class="highlight cpp"><table><tr><td class="gutter"><pre>${numbers}</pre></td><td class="code"><pre>int main() {}</pre></td></tr></table></figure></div><p>网络模拟器的节点和信道。</p>`;
  const post = applyExcerpt({ content, title: 'ns3' });
  assert.equal(post.excerpt, '<p>网络模拟器的节点和信道。</p>');
  assert.equal(post.content, content);
});

test('keeps paragraph boundaries and inline code, removes fenced code', () => {
  assert.equal(plainText('<h2>安装</h2><pre><code>apt install ns3</code></pre><p>使用 <code>NodeContainer</code>。</p>'), '安装 使用 NodeContainer。');
});

test('respects explicit excerpts, more markers and hidden summaries', () => {
  for (const excerpt of ['手写摘要', '<p>More 标记前的内容</p>', 'false']) {
    assert.equal(applyExcerpt({ excerpt, content: '<p>正文</p>' }).excerpt, excerpt);
  }
  assert.equal(applyExcerpt({ excerpt: false, content: '正文' }).excerpt, 'false');
});

test('description takes priority, with title fallback for code-only posts', () => {
  assert.equal(applyExcerpt({ description: '示例说明', content: '<p>正文</p>' }).excerpt, '<p>示例说明</p>');
  assert.equal(applyExcerpt({ content: '<pre>123</pre>', title: '示例代码' }).excerpt, '<p>示例代码</p>');
});

test('escapes HTML-like text and truncates Unicode without breaking emoji', () => {
  assert.equal(applyExcerpt({ content: '<p>&lt;host&gt; &amp; *literal*</p>' }).excerpt, '<p>&lt;host&gt; &amp; *literal*</p>');
  assert.equal(applyExcerpt({ content: '<p>学😀习笔记</p>' }, 4).excerpt, '<p>学😀习…</p>');
});
