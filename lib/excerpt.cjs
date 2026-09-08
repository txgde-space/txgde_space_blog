'use strict';

const { load } = require('cheerio');

function plainText(html) {
  const $ = load(String(html || ''), null, false);
  // A highlighted code block contains a separate column of line numbers.
  // Remove the entire block before extracting prose, keeping the article intact.
  $('figure.highlight, .code-container, pre, script, style, template, .gutter').remove();
  $('br').replaceWith(' ');
  $('p, div, h1, h2, h3, h4, h5, h6, li, tr, td, th, blockquote').append(' ');
  return $.root().text().replace(/\s+/gu, ' ').trim();
}

function applyExcerpt(data, length = 200) {
  // Redefine expects the string "false" to hide an excerpt.
  if (data.excerpt === false) data.excerpt = 'false';
  if (data.excerpt) return data; // Respect front matter and <!-- more -->.

  const text = plainText(data.description || data.content) || String(data.title || '阅读全文');
  const limit = Number.isInteger(length) && length > 0 ? length : 200;
  const chars = Array.from(text);
  const summary = chars.length > limit ? chars.slice(0, limit - 1).join('') + '…' : text;
  // HTML-escape and wrap so the theme's second Markdown pass cannot turn text
  // such as <host>, * or [link] into markup or remove literal characters.
  const $ = load('<p></p>', null, false);
  $('p').text(summary);
  data.excerpt = $.html();
  return data;
}

module.exports = { applyExcerpt, plainText };
