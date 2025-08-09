import { store } from './main.js';

// To-dos
const TODOS_KEY = 'daily.todos';
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const clearBtn = document.getElementById('todo-clear');

let todos = store.get(TODOS_KEY, []);
renderTodos();

form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: crypto.randomUUID(), text, done:false });
  input.value = '';
  persistTodos();
  renderTodos();
});

clearBtn?.addEventListener('click', ()=>{
  todos = todos.filter(t=>!t.done);
  persistTodos();
  renderTodos();
});

function persistTodos(){ store.set(TODOS_KEY, todos) }

function renderTodos(){
  if (!list) return;
  list.innerHTML = '';
  todos.forEach(t => {
    const li = document.createElement('li');
    li.className = 'card';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !!t.done;
    cb.addEventListener('change', ()=>{ t.done = cb.checked; persistTodos(); });

    const span = document.createElement('span');
    span.textContent = t.text;
    if (t.done) span.style.opacity = '0.6';

    const spacer = document.createElement('span');
    spacer.className = 'spacer';

    const del = document.createElement('button');
    del.className = 'danger';
    del.textContent = 'Delete';
    del.addEventListener('click', ()=>{ todos = todos.filter(x=>x.id!==t.id); persistTodos(); renderTodos(); });

    li.append(cb, span, spacer, del);
    list.appendChild(li);
  });
}

// Quick links
const LINKS_KEY = 'daily.links';
const linkForm = document.getElementById('link-form');
const linkName = document.getElementById('link-name');
const linkUrl = document.getElementById('link-url');
const linkList = document.getElementById('link-list');
let links = store.get(LINKS_KEY, []);
renderLinks();

linkForm?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = linkName.value.trim();
  const url = linkUrl.value.trim();
  if (!name || !url) return;
  links.push({ id: crypto.randomUUID(), name, url });
  linkName.value='';
  linkUrl.value='';
  persistLinks();
  renderLinks();
});

function persistLinks(){ store.set(LINKS_KEY, links) }

function renderLinks(){
  if (!linkList) return;
  linkList.innerHTML = '';
  links.forEach(l=>{
    const li = document.createElement('li');
    li.className = 'chip';
    const a = document.createElement('a');
    a.href = l.url; a.textContent = l.name; a.target = '_blank'; a.rel = 'noopener';
    const del = document.createElement('button');
    del.className = 'danger';
    del.textContent = '×';
    del.title = 'Remove';
    del.addEventListener('click', ()=>{ links = links.filter(x=>x.id!==l.id); persistLinks(); renderLinks(); });
    li.append(a, del);
    linkList.appendChild(li);
  })
}

// Notes
const NOTES_KEY = 'daily.notes';
const notes = document.getElementById('notes');
if (notes){
  notes.value = store.get(NOTES_KEY, '');
  notes.addEventListener('input', ()=> store.set(NOTES_KEY, notes.value));
}
