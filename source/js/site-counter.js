/* Load the public counter only on the production origin, including after Swup navigation. */
(() => {
  if (window.location.origin !== 'https://blog.txgde.space') return;
  const script = document.createElement('script');
  script.src = 'https://cn.vercount.one/js';
  script.async = true;
  script.dataset.siteCounter = '';
  document.querySelectorAll('script[data-site-counter]').forEach(node => node.remove());
  document.body.appendChild(script);
})();
