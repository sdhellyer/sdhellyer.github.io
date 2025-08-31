import { store } from './main.js';

// Lightweight, extensible bookmarks inspired by startpages like nightTab/Heimdall
// Data model: { groups: [{ id, name, links: [{ id, name, url, icon }] }], layout: 'tiles' | 'list' }
const KEY = 'site.bookmarks.v1';
const DEFAULT = {
  layout: 'tiles',
  groups: [
    {
      id: crypto.randomUUID(),
      name: 'Daily',
      links: [
        { id: crypto.randomUUID(), name: 'Gmail', url: 'https://mail.google.com', icon: '' },
        { id: crypto.randomUUID(), name: 'Calendar', url: 'https://calendar.google.com', icon: '' },
        { id: crypto.randomUUID(), name: 'GitHub', url: 'https://github.com', icon: '' }
      ]
    },
    {
      id: crypto.randomUUID(),
      name: 'Dev',
      links: [
        { id: crypto.randomUUID(), name: 'MDN', url: 'https://developer.mozilla.org', icon: '' },
        { id: crypto.randomUUID(), name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '' }
      ]
    }
  ]
};

let state = store.get(KEY, DEFAULT);

// Elements
const groupsEl = document.getElementById('bm-groups');
const editToggle = document.getElementById('bm-edit-toggle');
const addGroupRow = document.getElementById('bm-add-group');
const addGroupName = document.getElementById('bm-group-name');
const addGroupBtn = document.getElementById('bm-add-group-btn');

if (groupsEl) {
  render();
}

editToggle?.addEventListener('click', () => {
  document.body.classList.toggle('bm-edit');
  addGroupRow?.classList.toggle('hidden', !document.body.classList.contains('bm-edit'));
});

addGroupBtn?.addEventListener('click', () => {
  const name = (addGroupName?.value || '').trim();
  if (!name) return;
  state.groups.push({ id: crypto.randomUUID(), name, links: [] });
  addGroupName.value = '';
  save();
  render();
});

function save() { store.set(KEY, state); }

function render() {
  if (!groupsEl) return;
  groupsEl.innerHTML = '';
  state.groups.forEach(group => groupsEl.appendChild(renderGroup(group)));
}

function renderGroup(group) {
  const wrap = document.createElement('section');
  wrap.className = 'bm-group';

  // Header
  const header = document.createElement('div');
  header.className = 'bm-group-header';

  const title = document.createElement('input');
  title.className = 'bm-group-title';
  title.value = group.name;
  title.setAttribute('aria-label', 'Group name');
  title.disabled = !document.body.classList.contains('bm-edit');
  title.addEventListener('input', () => { group.name = title.value; save(); });

  const headerBtns = document.createElement('div');
  headerBtns.className = 'bm-header-actions';

  const addLinkBtn = document.createElement('button');
  addLinkBtn.textContent = 'Add link';
  addLinkBtn.className = 'secondary';
  addLinkBtn.title = 'Add link';
  addLinkBtn.addEventListener('click', () => openAddLink(group));

  const delGroupBtn = document.createElement('button');
  delGroupBtn.textContent = 'Delete';
  delGroupBtn.className = 'danger';
  delGroupBtn.title = 'Delete group';
  delGroupBtn.addEventListener('click', () => {
    if (!confirm('Delete group?')) return;
    state.groups = state.groups.filter(g => g.id !== group.id);
    save();
    render();
  });

  headerBtns.append(addLinkBtn, delGroupBtn);
  header.append(title, headerBtns);

  // Links grid
  const list = document.createElement('ul');
  list.className = 'bm-tile-list';

  group.links.forEach(link => list.appendChild(renderLink(group, link)));

  wrap.append(header, list);
  return wrap;
}

function renderLink(group, link) {
  const li = document.createElement('li');
  li.className = 'bm-tile';

  const a = document.createElement('a');
  a.href = link.url; a.target = '_blank'; a.rel = 'noopener';

  const icon = document.createElement('div');
  icon.className = 'bm-icon';
  icon.textContent = (link.name || '?').slice(0, 2).toUpperCase();

  const name = document.createElement('div');
  name.className = 'bm-name';
  name.textContent = link.name;

  a.append(icon, name);

  const actions = document.createElement('div');
  actions.className = 'bm-actions';

  const editBtn = document.createElement('button');
  editBtn.textContent = '✎';
  editBtn.title = 'Edit link';
  editBtn.addEventListener('click', (e) => { e.preventDefault(); openEditLink(group, link); });

  const delBtn = document.createElement('button');
  delBtn.textContent = '×';
  delBtn.className = 'danger';
  delBtn.title = 'Remove link';
  delBtn.addEventListener('click', (e) => {
    e.preventDefault();
    group.links = group.links.filter(l => l.id !== link.id);
    save();
    render();
  });

  actions.append(editBtn, delBtn);

  li.append(a, actions);
  return li;
}

function openAddLink(group) {
  const name = prompt('Link name');
  if (!name) return;
  const url = prompt('URL (https://...)');
  if (!url) return;
  group.links.push({ id: crypto.randomUUID(), name, url, icon: '' });
  save();
  render();
}

function openEditLink(group, link) {
  const name = prompt('Link name', link.name);
  if (!name) return;
  const url = prompt('URL (https://...)', link.url);
  if (!url) return;
  link.name = name; link.url = url;
  save();
  render();
}
