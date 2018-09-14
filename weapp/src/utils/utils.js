export function debounce(func, delay = 100) {
  let timer = null;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, arguments), delay);
  }
}

export function throttle(func, delay = 50, deadline = 100) {
  let timer = null,
    previous = 0;
  return function() {
    const now = Date.now();
    if (!previous) previous = now;
    clearTimeout(timer);
    if (now - previous >= deadline) {
      func.apply(this, arguments);
      previous = now;
    } else {
      timer = setTimeout(() => func.apply(this, arguments), delay);
    }
  }
}