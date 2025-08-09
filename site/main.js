// Theme toggle + tiny storage helper
const root = document.documentElement;
const THEME_KEY = 'site.theme';
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) root.setAttribute('data-theme', savedTheme);

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  if (next === 'dark') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', 'light');
  localStorage.setItem(THEME_KEY, root.getAttribute('data-theme') || 'dark');
});

export const store = {
  get(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }},
  set(key, value){ localStorage.setItem(key, JSON.stringify(value)) }
};
