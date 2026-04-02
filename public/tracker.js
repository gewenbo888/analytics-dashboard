// Analytics Tracker — add to any site:
// <script defer src="https://analytics-dashboard-xyz.vercel.app/tracker.js"></script>
(function() {
  'use strict';
  var API = (document.currentScript && document.currentScript.src)
    ? new URL(document.currentScript.src).origin + '/api/collect'
    : '/api/collect';

  function send() {
    var data = {
      hostname: location.hostname,
      path: location.pathname,
      referrer: document.referrer || '',
      screen: String(window.innerWidth),
      language: navigator.language || ''
    };
    if (navigator.sendBeacon) {
      navigator.sendBeacon(API, JSON.stringify(data));
    } else {
      fetch(API, {
        method: 'POST',
        body: JSON.stringify(data),
        keepalive: true,
        headers: { 'Content-Type': 'application/json' }
      }).catch(function() {});
    }
  }

  // Track on page load
  if (document.readyState === 'complete') {
    send();
  } else {
    window.addEventListener('load', send);
  }

  // Track SPA navigation (pushState)
  var origPush = history.pushState;
  history.pushState = function() {
    origPush.apply(this, arguments);
    setTimeout(send, 50);
  };
  window.addEventListener('popstate', function() {
    setTimeout(send, 50);
  });
})();
