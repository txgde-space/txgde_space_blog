'use strict';

const { load } = require('cheerio');

// Keep adaptations outside node_modules. Moment is used only by the theme's
// essays page; normal articles and their date labels do not depend on it.
hexo.extend.filter.register('after_render:html', function (html) {
  const $ = load(html);
  if (!$('.essay-date').length) {
    $('script[src$="/moment-with-locales.min.js"]').remove();
  }
  // This site serves its fonts locally, so these connections are unused.
  $('link[rel="preconnect"][href="https://fonts.googleapis.com"], link[rel="preconnect"][href="https://fonts.gstatic.com"]').remove();

  // Hide empty labels until the counter returns a number. This also avoids
  // showing misleading labels on local/Vercel preview origins and on failure.
  $('.article-pv:has(#busuanzi_value_page_pv)').attr('id', 'busuanzi_container_page_pv');
  // Inline priority overrides Tailwind's important display utilities. Vercount
  // replaces this display property when its request succeeds, revealing counts.
  $('[id^="busuanzi_container_"]').attr('style', 'display: none !important;');
  return $.html();
}, 20);
