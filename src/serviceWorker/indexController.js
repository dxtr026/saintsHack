
export function _registerServiceWorker() {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/service_worker_mobile.js').then(function(reg) {
    if (!navigator.serviceWorker.controller) {
      return;
    }

    if (reg.waiting) {
      _updateReady(reg.waiting);
      return;
    }

    if (reg.installing) {
      _trackInstalling(reg.installing);
      return;
    }

    reg.addEventListener('updatefound', function() {
      _trackInstalling(reg.installing);
    });
  }).catch(function(err){
  });

  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".
  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    initAddFrame()
    refreshing = true;
  });
};

function initAddFrame () {
  if (window.loaded) {
    addFrames()
  } else {
    window.addEventListener('load', addFrames)
  }
}

function addFrames () {
  // addFrame(window.location.pathname+window.location.search)
}

function _trackInstalling(worker) {
  if (!worker) {return}
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
      _updateReady(worker);
    }
  });
};

function _updateReady(worker) {
  worker.postMessage({action: 'skipWaiting'});
};



