'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { prepareSearchModule } = require('../lib/search-module.cjs');

hexo.extend.filter.register('after_generate', function () {
  const file = path.join(this.theme_dir, 'source/js/tools/localSearch.js');
  const data = prepareSearchModule(fs.readFileSync(file, 'utf8'));
  this.route.set('js/build/tools/localSearch.js', data);
});
