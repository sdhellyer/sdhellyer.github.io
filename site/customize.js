import { store } from './main.js';

const KEY = 'site.customize.v1';
const defaults = { accent: '#6ea8fe', animate: false, noise: false, container: 1000, radius: 12, glass: 6, shadow: 0.15 };
const state = Object.assign({}, defaults, store.get(KEY, {}));

const $ = (s)=>document.querySelector(s);
const root = document.documentElement;

function apply(){
  root.style.setProperty('--container-max', state.container + 'px');
  root.style.setProperty('--radius', state.radius + 'px');
  root.style.setProperty('--glass-blur', state.glass + 'px');
  root.style.setProperty('--shadow-strength', state.shadow);
  root.style.setProperty('--accent', state.accent);
  document.body.style.setProperty('--bg1', getComputedStyle(root).getPropertyValue('--bg1') || '#0b0c0f');
  document.body.style.setProperty('--bg2', getComputedStyle(root).getPropertyValue('--bg2') || '#151821');
  document.body.style.setProperty('--noise', state.noise ? 1 : 0);
  document.body.style.setProperty('--noise-opacity', state.noise ? 0.03 : 0);
  document.body.style.setProperty('--bg-animate', state.animate ? 1 : 0);
}

function save(){ store.set(KEY, state); }

// Controls
const toggle = $('#customize-toggle');
const drawer = $('#customize');
const closeBtn = $('#c-close');
const resetBtn = $('#c-reset');
const accent = $('#c-accent');
const swatches = [...document.querySelectorAll('.swatches button')];
const animate = $('#c-animate');
const noise = $('#c-noise');
const container = $('#c-container');
const radius = $('#c-radius');
const glass = $('#c-glass');
const shadow = $('#c-shadow');

// Init values
if (accent) accent.value = state.accent;
if (animate) animate.checked = !!state.animate;
if (noise) noise.checked = !!state.noise;
if (container) container.value = state.container;
if (radius) radius.value = state.radius;
if (glass) glass.value = state.glass;
if (shadow) shadow.value = state.shadow;

apply();

// Events
 toggle?.addEventListener('click', ()=> drawer?.classList.toggle('hidden'));
 closeBtn?.addEventListener('click', ()=> drawer?.classList.add('hidden'));
 resetBtn?.addEventListener('click', ()=>{
   Object.assign(state, defaults); save(); apply();
   if (accent) accent.value = state.accent;
   if (animate) animate.checked = state.animate;
   if (noise) noise.checked = state.noise;
   if (container) container.value = state.container;
   if (radius) radius.value = state.radius;
   if (glass) glass.value = state.glass;
   if (shadow) shadow.value = state.shadow;
 });
 accent?.addEventListener('input', ()=>{ state.accent = accent.value; save(); apply(); });
 swatches.forEach(b=> b.addEventListener('click', ()=>{ state.accent = b.dataset.swatch; if (accent) accent.value = state.accent; save(); apply(); }));
 animate?.addEventListener('change', ()=>{ state.animate = animate.checked; save(); apply(); });
 noise?.addEventListener('change', ()=>{ state.noise = noise.checked; save(); apply(); });
 container?.addEventListener('input', ()=>{ state.container = parseInt(container.value,10); save(); apply(); });
 radius?.addEventListener('input', ()=>{ state.radius = parseInt(radius.value,10); save(); apply(); });
 glass?.addEventListener('input', ()=>{ state.glass = parseInt(glass.value,10); save(); apply(); });
 shadow?.addEventListener('input', ()=>{ state.shadow = parseFloat(shadow.value); save(); apply(); });
