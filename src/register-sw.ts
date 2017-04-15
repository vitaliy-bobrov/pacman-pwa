((window, document) => {

  if ('serviceWorker' in navigator &&
      window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/pacman-pwa/service-worker.js', {scope: '/pacman-pwa/'})
      .then(registration => {
        registration.onupdatefound = () => {

          if (navigator.serviceWorker.controller) {
            const installingWorker = registration.installing;

            installingWorker.onstatechange = () => {
              switch (installingWorker.state) {
                case 'installed':
                  break;

                case 'redundant':
                  throw new Error('The installing ' +
                    'service worker became redundant.');

                default:
                  // Ignore
              }
            };
          }
        };
      }).catch(e => {
        console.error('Error during service worker registration:', e);
      });
  }
})(window, document);
