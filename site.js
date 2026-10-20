/* =====================================================================
   SHARED SITE SCRIPT. Loaded on every page.
   Edit CONFIG, LINEUP and PRODUCTS here. The menu and footer are also built here,
   so a change to either appears on all pages.
   ===================================================================== */
const CONFIG = {
  producer: 'Star Gate Events (Pvt) Ltd',
  whatsapp: '94779550171',             // WhatsApp number, country code first, no + or spaces
  ticketUrl: 'https://www.ticketsministry.com',
  social: {                            // replace with your real page links
    facebook:  'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    tiktok:    'https://www.tiktok.com/'
  },
  contacts: [
    { name: 'Nadeesha', phone: '070 590 4903' },
    { name: 'Sandinu',  phone: '077 955 0171' }
  ]
};

/* Lineup. Set photo to a path like 'img/raini.jpg' to replace a placeholder. */
const LINEUP = {
  headliner: { name: '2forty2', role: 'Live band', photo: null },
  artists: [
    { name: 'Raini Charuka Goonathilake', photo: null },
    { name: 'Mihindu Ariyaratne', photo: null },
    { name: 'Ridma Weerawardena', photo: null },
    { name: 'Billy Fernando', photo: null }
  ]
};

/* Shop. Replace prices, names and set img to a product photo path. */
const PRODUCTS = [
  { id: 'tee',    name: 'Event tee',          price: 3500, note: 'Black cotton, gold print.', img: null },
  { id: 'cap',    name: 'Heritage Moves cap', price: 2500, note: 'Black cap, gold stitching.', img: null },
  { id: 'tote',   name: 'Canvas tote',        price: 1800, note: 'Heavy canvas, logo print.', img: null },
  { id: 'poster', name: 'Logo poster, A2',    price: 2000, note: 'Gold foil on black stock.', img: null },
  { id: 'pin',    name: 'Enamel pin',         price: 1200, note: 'Gold-plated, flourish design.', img: null },
  { id: 'mask',   name: 'Miniature mask',     price: 4500, note: 'Hand-painted keepsake.', img: null }
];

/* Pages: file, label, key (matches <body data-page="key">) */
const PAGES = [
  ['index.html', 'Home', 'home'],
  ['the-night.html', 'The Night', 'night'],
  ['ground-plan.html', 'Ground Plan', 'plan'],
  ['heritage-moves.html', 'Heritage Moves', 'heritage'],
  ['gallery.html', 'Gallery', 'gallery'],
  ['shop.html', 'Shop', 'shop'],
  ['phase-2.html', 'Phase 2', 'phase2'],
  ['contact.html', 'Contact', 'contact']
];

/* ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => 'LKR ' + n.toLocaleString('en-US');
const ICON_IMG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="9" cy="10" r="1.8"/><path d="M3 18l6-5 4 3 3-2 5 4"/></svg>';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function waLink(text) { return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text); }
async function copyText(text, btn) {
  const old = btn.textContent;
  try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied'; }
  catch (e) { btn.textContent = 'Select and copy'; }
  setTimeout(() => { btn.textContent = old; }, 1800);
}

/* ---------- header, footer, cart shell ---------- */
(function shell() {
  const key = document.body.dataset.page;
  const page = (k) => PAGES.find(p => p[2] === k)[0];

  $('#site-header').outerHTML =
    '<header class="top"><div class="wrap">' +
    '<a class="brand" href="index.html" aria-label="Thambapanni Colombo Night, home"><b>THAMBAPANNI</b><span>Colombo Night</span></a>' +
    '<button class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="nav" aria-label="Menu">' +
    '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 6h16M3 11h16M3 16h16"/></svg></button>' +
    '<nav class="nav" id="nav" aria-label="Main">' +
    PAGES.map(p => '<a href="' + p[0] + '"' + (p[2] === key ? ' aria-current="page"' : '') + '>' + p[1] + '</a>').join('') +
    '<button class="bag" id="bag-btn" type="button">Bag (<span id="bag-n">0</span>)</button>' +
    '</nav></div></header>';

  $('#site-footer').outerHTML =
    '<footer class="foot"><div class="wrap">' +
    '<div class="prose"><a class="brand" href="index.html"><b>THAMBAPANNI</b><span>Colombo Night</span></a>' +
    '<p class="small">An event by Star Gate Events (Pvt) Ltd. Named for Thambapanni, the ancient name of Sri Lanka.</p>' +
    '<div class="social" data-social></div></div>' +
    '<div><p class="label" style="margin-bottom:14px">Explore</p><ul>' +
    ['night', 'plan', 'heritage', 'gallery'].map(k => '<li><a href="' + page(k) + '">' + PAGES.find(p => p[2] === k)[1] + '</a></li>').join('') +
    '</ul></div>' +
    '<div><p class="label" style="margin-bottom:14px">Join us</p><ul>' +
    '<li><a href="shop.html">Shop</a></li><li><a href="phase-2.html">Phase 2, 2027</a></li><li><a href="contact.html">Contact</a></li></ul></div>' +
    '</div><div class="legal"><div class="wrap"><span>&copy; 2026 Star Gate Events (Pvt) Ltd</span><span>Event photography by Dreamlense</span></div></div></footer>' +
    '<div id="cart-bd" hidden></div>' +
    '<aside id="cart" role="dialog" aria-label="Your bag" aria-modal="true" hidden>' +
    '<header><h2>Your bag</h2><button class="lb-btn" id="cart-x" type="button" aria-label="Close bag">&times;</button></header>' +
    '<div class="items" id="cart-items"></div>' +
    '<footer><div class="total"><span>Total</span><span id="cart-total">LKR 0</span></div>' +
    '<a class="btn solid" id="cart-wa" href="#" target="_blank" rel="noopener">Send order on WhatsApp</a>' +
    '<button class="btn small" id="cart-copy" type="button">Copy order text</button>' +
    '<p class="muted" style="font-size:1rem">Sizes, colours and delivery are confirmed with the team after you send your order.</p></footer></aside>';

  $('#menu-btn').addEventListener('click', () => {
    const open = $('#nav').classList.toggle('open');
    $('#menu-btn').setAttribute('aria-expanded', String(open));
  });
})();

/* ---------- shared content ---------- */
(function fill() {
  const S = CONFIG.social;
  const ico = {
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.5V13h2.8v8h3.2z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.3 2.3 1.7 3.9 4 4.1v3.1c-1.4 0-2.7-.4-4-1.2v6.2c0 3.2-2.6 5.8-5.8 5.8S4.9 18.4 4.9 15.2s2.6-5.8 5.8-5.8c.3 0 .6 0 .9.1v3.2a2.7 2.7 0 1 0 1.9 2.6V3h3.1z"/></svg>'
  };
  const html = Object.keys(S).map(k => '<a href="' + esc(S[k]) + '" target="_blank" rel="noopener" aria-label="' + k + '">' + ico[k] + '</a>').join('');
  $$('[data-social]').forEach(el => { el.innerHTML = html; });

  $$('[data-ticket-link]').forEach(a => { a.href = CONFIG.ticketUrl; });

  const home = $('#home-lineup');
  if (home) home.textContent = [LINEUP.headliner.name].concat(LINEUP.artists.map(a => a.name)).join(', ') + '.';

  const lineup = $('#lineup');
  if (lineup) {
    const ph = label => '<div class="ph">' + ICON_IMG + '<span>' + esc(label) + '</span></div>';
    const pic = (a, label) => a.photo ? '<img src="' + esc(a.photo) + '" alt="' + esc(a.name) + '" style="width:100%;height:100%;object-fit:cover">' : ph(label);
    const h = LINEUP.headliner;
    lineup.innerHTML =
      '<div class="headliner"><div>' + (h.photo ? '<img src="' + esc(h.photo) + '" alt="' + esc(h.name) + '" style="width:100%;height:100%;object-fit:cover">' : ph('Band photo')) + '</div>' +
      '<div class="txt"><p class="label">Headline act</p><h3>' + esc(h.name) + '</h3><p class="muted">' + esc(h.role) + ', main stage.</p></div></div>' +
      '<div class="artists">' + LINEUP.artists.map(a => '<div class="artist"><div style="aspect-ratio:3/4">' + pic(a, 'Artist photo').replace('class="ph"', 'class="ph" style="height:100%"') + '</div><div><p class="label">Artist</p><h3>' + esc(a.name) + '</h3></div></div>').join('') + '</div>';
  }

  const contacts = $('#contacts');
  if (contacts) {
    contacts.innerHTML = CONFIG.contacts.map(c =>
      '<div class="card"><p class="label">Call or WhatsApp</p><h3>' + esc(c.name) + '</h3><p class="phone">' + esc(c.phone) + '</p>' +
      '<div class="btn-row"><button class="btn small" type="button" data-copy="' + esc(c.phone) + '">Copy number</button></div></div>').join('') +
      '<div class="card"><p class="label">Message</p><h3>WhatsApp</h3><p class="muted">Fastest way to reach the team about tickets, stalls and partnerships.</p><div class="btn-row"><a class="btn small solid" id="wa-contact" href="#" target="_blank" rel="noopener">Open WhatsApp</a></div></div>';
    $$('[data-copy]').forEach(b => b.addEventListener('click', () => copyText(b.dataset.copy, b)));
    $('#wa-contact').href = waLink('Hello Star Gate Events, I have a question about Thambapanni Colombo Night.');
  }
  const wi = $('#wa-interest');
  if (wi) wi.href = waLink('Hello Star Gate Events, please keep me updated about Thambapanni Colombo Night Phase 2 (2027).');
})();

/* ---------- shop grid + bag (bag is remembered between pages) ---------- */
const Cart = (function () {
  const KEY = 'tcn-bag';
  let state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { state = {}; }
  Object.keys(state).forEach(id => { if (!PRODUCTS.some(p => p.id === id)) delete state[id]; });
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  const grid = $('#products');
  if (grid) {
    grid.innerHTML = PRODUCTS.map(p =>
      '<div class="product">' + (p.img ? '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" style="aspect-ratio:1/1;object-fit:cover;width:100%">' : '<div class="ph">' + ICON_IMG + '<span>Product photo</span></div>') +
      '<div><h3>' + esc(p.name) + '</h3><p>' + esc(p.note) + '</p></div>' +
      '<div class="buy"><b>' + money(p.price) + '</b><button class="btn small" type="button" data-add="' + p.id + '">Add to bag</button></div></div>').join('');
    $$('[data-add]', grid).forEach(b => b.addEventListener('click', () => { add(b.dataset.add, 1); b.textContent = 'Added'; setTimeout(() => { b.textContent = 'Add to bag'; }, 1200); }));
  }
  const count = () => Object.values(state).reduce((a, b) => a + b, 0);
  const total = () => PRODUCTS.reduce((s, p) => s + (state[p.id] || 0) * p.price, 0);
  function orderText() {
    const lines = PRODUCTS.filter(p => state[p.id]).map(p => '- ' + p.name + ' x' + state[p.id] + ' (' + money(p.price * state[p.id]) + ')');
    return 'Hello Star Gate Events, I would like to order:\n' + lines.join('\n') + '\nTotal: ' + money(total());
  }
  function render() {
    $('#bag-n').textContent = count();
    const items = PRODUCTS.filter(p => state[p.id]);
    $('#cart-items').innerHTML = items.length ? items.map(p =>
      '<div class="line"><b>' + esc(p.name) + '</b><span>' + money(p.price * state[p.id]) + '</span>' +
      '<div class="qty"><button type="button" data-q="' + p.id + '" data-d="-1" aria-label="Fewer ' + esc(p.name) + '">&minus;</button><span>' + state[p.id] + '</span><button type="button" data-q="' + p.id + '" data-d="1" aria-label="More ' + esc(p.name) + '">+</button></div></div>').join('')
      : '<p class="muted" style="padding:20px 0">Your bag is empty. Add something from the <a href="shop.html">shop</a>.</p>';
    $$('[data-q]', $('#cart-items')).forEach(b => b.addEventListener('click', () => add(b.dataset.q, +b.dataset.d)));
    $('#cart-total').textContent = money(total());
    const wa = $('#cart-wa'); wa.href = items.length ? waLink(orderText()) : '#';
    wa.style.opacity = items.length ? 1 : .45; wa.style.pointerEvents = items.length ? 'auto' : 'none';
  }
  function add(id, d) { state[id] = Math.max(0, (state[id] || 0) + d); if (!state[id]) delete state[id]; save(); render(); }
  const open = () => { $('#cart').hidden = false; $('#cart-bd').hidden = false; $('#cart-x').focus(); };
  const close = () => { $('#cart').hidden = true; $('#cart-bd').hidden = true; };
  $('#bag-btn').addEventListener('click', open);
  $('#cart-x').addEventListener('click', close);
  $('#cart-bd').addEventListener('click', close);
  $('#cart-copy').addEventListener('click', e => copyText(count() ? orderText() : 'Your bag is empty', e.currentTarget));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#cart').hidden) close(); });
  render();
})();
