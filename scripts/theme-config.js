'use strict';

// Hexo deep-merges arrays by index, leaving upstream example entries behind.
// Replace the site's ordered lists after merging, before templates are rendered.
hexo.extend.filter.register('before_generate', function () {
  const custom = this.config.theme_config?.home_banner;
  if (!custom) return;
  const banner = this.theme.config.home_banner;
  if (Array.isArray(custom.subtitle?.text)) banner.subtitle.text = [...custom.subtitle.text];
  for (const key of ['links', 'qrs']) {
    if (Array.isArray(custom.social_links?.[key])) {
      banner.social_links[key] = custom.social_links[key].map(item => ({ ...item }));
    }
  }
}, 0);
