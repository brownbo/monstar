export function getLocaleFullDateString(date, sep = '-') {
  date = new Date(date);
  date = new Date(+date - date.getTimezoneOffset() * 60 * 1000);
  date = date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
  if (sep !== '-') date.replace(/-/g, sep);
  return date;
}

export function getLocaleDateString(date, sep = '-') {
  return getLocaleFullDateString(date, sep).split(' ')[0];
}

export function getLocaleTimeString(date, sep = '-') {
  return getLocaleFullDateString(date, sep).split(' ')[1];
}

export function getCookies(setCookie) {
  // return setCookie.split(/(?=\S),(?=\S)/).map(cookie => cookie.split(';', 1)[0]).join('; ');
  return setCookie.split(',').filter(str => str.includes('=')).map(cookie => cookie.split(';', 1)[0]).join('; ');
}
export function price(price) {
    return price?(price/100).toFixed(2):0;
}
