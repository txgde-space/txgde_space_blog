'use strict';

const { applyExcerpt } = require('../lib/excerpt.cjs');

// Run after Hexo extracts explicit excerpts and the theme decorates code blocks.
hexo.extend.filter.register('after_post_render', function (data) {
  return applyExcerpt(data, this.theme.config.home?.excerpt_length);
}, 50);
