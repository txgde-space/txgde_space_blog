'use strict';

// Redefine 2.9.0 does not rerun a query typed while the first fetch is pending.
// Adapt its source at build time, retaining the upstream search implementation.
function prepareSearchModule(source) {
  const replacements = [
    ['let isFetched = false;', 'let isFetched = false;\nlet isFetching = false;'],
    ['if (isFetched || !cachedPath)', 'if (isFetched || isFetching || !cachedPath)'],
    ['  fetch(config.root + cachedPath)', '  isFetching = true;\n  fetch(config.root + cachedPath)'],
    ['.then((response) => response.text())', '.then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.text(); })'],
    ['      isFetched = true;\n', ''],
    ['      cachedData = normalizeData(cachedData);', '      cachedData = normalizeData(cachedData);\n      isFetched = true;'],
    ['    .catch((error) => {', `    .then(() => {
      const input = document.querySelector('.search-input');
      if (input?.value.trim()) renderSearchResult(input);
    })
    .catch((error) => {`],
    ['      console.error("Failed to load search data:", error);\n    });', `      console.error("Failed to load search data:", error);
      const result = document.querySelector('#search-result');
      if (result) result.textContent = '搜索索引加载失败，请关闭搜索后重试。';
    })
    .finally(() => { isFetching = false; });`]
  ];
  for (const [before, after] of replacements) {
    if (source.split(before).length !== 2) throw new Error(`Theme search changed; review adaptation: ${before}`);
    source = source.replace(before, after);
  }
  return source;
}

module.exports = { prepareSearchModule };
