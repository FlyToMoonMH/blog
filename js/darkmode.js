(function() {
  const saveToLocal = {
    set: function(key, value, ttl) {
      if (ttl === 0) return;
      const now = new Date();
      const item = { value: value, expiry: now.getTime() + ttl * 86400000 };
      localStorage.setItem(key, JSON.stringify(item));
    },
    get: function(key) {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return undefined;
      const item = JSON.parse(itemStr);
      if (new Date().getTime() > item.expiry) {
        localStorage.removeItem(key);
        return undefined;
      }
      return item.value;
    }
  };

  window.activateDarkMode = function() {
    document.documentElement.setAttribute('data-theme', 'dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#0d0d0d');
    const btn = document.getElementById('colormode');
    if (btn) btn.innerHTML = '<i class="fas fa-sun"></i>';
  };

  window.activateLightMode = function() {
    document.documentElement.setAttribute('data-theme', 'light');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#ffffff');
    const btn = document.getElementById('colormode');
    if (btn) btn.innerHTML = '<i class="fas fa-moon"></i>';
  };

  const t = saveToLocal.get('theme');
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const notSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches;
  const noSupport = !isDark && !isLight && !notSpecified;

  if (t === undefined) {
    if (isLight) activateLightMode();
    else if (isDark) activateDarkMode();
    else if (notSpecified || noSupport) {
      const hour = new Date().getHours();
      (hour <= 6 || hour >= 18) ? activateDarkMode() : activateLightMode();
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (saveToLocal.get('theme') === undefined) {
        e.matches ? activateDarkMode() : activateLightMode();
      }
    });
  } else if (t === 'light') activateLightMode();
  else activateDarkMode();

  window.switchColorMode = function() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      activateLightMode();
      saveToLocal.set('theme', 'light', 2);
    } else {
      activateDarkMode();
      saveToLocal.set('theme', 'dark', 2);
    }
  };
})();
