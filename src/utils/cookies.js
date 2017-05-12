
export function writeCookie (key, value, days = 60) {
  if (typeof(window)==='undefined') {
    return
  }
  // Default at 60 days.
  let str, todayDate;
  if ( days === 0 ) {
    str = '';
  } else {
    todayDate = Date.now();
  }
  // Get unix milliseconds at current time plus number of days
  const date = new Date(todayDate + (days * 86400000)); // 24 * 60 * 60 * 1000
  str = ` expires=${date.toGMTString()};`;

  if ( window && window.document && window.document.cookie ) {
    window.document.cookie = `${key}=${value};${str} path=/;`;
  }
}

export function getCookie (check) {
  let cookies = [];
  if ( (typeof(window)!=='undefined') && window.document && window.document.cookie ) {
    cookies = document.cookie.split(';');
  }
  let tempCookie = '';
  let cookieKey = '';
  let cookieValue = null;

  cookies.filter((item) => {
    tempCookie = item.split('=');
    cookieKey = tempCookie[0].replace(/^\s+|\s+$/g, '');
    if ( cookieKey === check && tempCookie.length > 1 ) {
      cookieValue = decodeURIComponent(tempCookie[1].replace(/^\s+|\s+$/g, ''));
      return true;
    }
  });
  return cookieValue;
}
