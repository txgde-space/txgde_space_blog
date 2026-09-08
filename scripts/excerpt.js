'use strict';

const { applyExcerpt, plainText } = require('../lib/excerpt.cjs');

// Run after Hexo extracts explicit excerpts and the theme decorates code blocks.
hexo.extend.filter.register('after_post_render', function (data) {
  applyExcerpt(data, this.theme.config.home?.excerpt_length);
  if (!data.description) {
    const text = plainText(data.excerpt === 'false' ? data.content : data.excerpt) || data.title;
    data.description = Array.from(text).slice(0, 200).join('');
  }
  return data;
}, 50);
