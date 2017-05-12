import isServer from './filter/isServer';

const isLocalStorageAccessible = (() => {
  let isStorageAccessible;

  return function () {
    if (!isStorageAccessible) {
      isStorageAccessible = !!(!isServer() && window && window.localStorage);
    }
    return isStorageAccessible;
  };
})();

export function readLocalStorage (key) {
  try {
    if (isLocalStorageAccessible() && window.localStorage[key] && window.localStorage[key]!= 'undefined') {
      return window.localStorage[key]
    }
    return null
  } catch (e) {
    return null;
  }
}
export function writeLocalStorage (key, value) {
  try {
    return isLocalStorageAccessible() && window.localStorage.setItem(key, value);
  } catch (e) {
    return null;
  }
}

export function deleteLocalStorage (key) {
  try {
    return isLocalStorageAccessible() && key && (delete window.localStorage[key]);
  } catch (e) {
    return null;
  }
}

// export function getFromLocalStorage (key) {
//   let offline = readLocalStorage('offline')
//   try {
//     offline = JSON.parse(offline) || {}
//   } catch(e) {
//     offline  = {}
//   }
//   return offline[key]
// }

// export function addToLocalStorage (key) {
//   let offline = readLocalStorage('offline')
//   try {
//     offline = JSON.parse(offline) || {}
//   } catch(e) {
//     offline  = {}
//   }
//   offline[key] = true
//   writeLocalStorage('offline', JSON.stringify(offline))
// }


