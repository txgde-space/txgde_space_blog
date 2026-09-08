'use strict';

// Hexo's permalink/archive generators use Moment's process-local timezone even
// when config.timezone is set. Pin it before loading Hexo on every platform.
process.env.TZ = 'Asia/Shanghai';
require('hexo/bin/hexo');
