import { CATEGORIES } from './scene/products.js';

/* =========================================================
   All DOM overlay wiring: custom cursor, glass product card,
   floating chips, cart panel, quick view, sound + toast.
   ========================================================= */
export function createUI(ctx) {
  const $ = (s) => document.querySelector(s);
  const cart = [];
  let current = null;         // active product data
  let currentColor = 0, currentSize = null;

  // ---- custom magnetic cursor ----
  const cursor = document.createElement('div');
  cursor.id = 'cursor'; document.body.appendChild(cursor);
  let cx = 0, cy = 0, tx = 0, ty = 0;
  (function loop() {
    cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  document.addEventListener('pointerup', () => cursor.classList.remove('is-down'));

  // ---- toast ----
  const toast = $('#toast'); let toastT;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // ---- product card ----
  const product = $('#product');
  function showProduct(data, getShoe) {
    current = data; currentColor = 0; currentSize = data.product.sizes[0];
    $('#pEyebrow').textContent = data.category.title;
    $('#pName').textContent = data.product.name;
    $('#pPrice').textContent = '$' + data.product.price;

    // colours
    const colWrap = $('#pColors'); colWrap.innerHTML = '';
    data.product.colors.forEach((c, i) => {
      const s = document.createElement('button');
      s.className = 'swatch' + (i === 0 ? ' is-active' : '');
      s.style.background = c;
      s.onclick = () => {
        currentColor = i;
        colWrap.querySelectorAll('.swatch').forEach((n) => n.classList.remove('is-active'));
        s.classList.add('is-active');
        retintShoe(getShoe && getShoe(), c);   // retint the real shoe in the scene
      };
      colWrap.appendChild(s);
    });
    // sizes
    const sizeWrap = $('#pSizes'); sizeWrap.innerHTML = '';
    data.product.sizes.forEach((sz, i) => {
      const b = document.createElement('button');
      b.className = 'size' + (i === 0 ? ' is-active' : '');
      b.textContent = 'UK ' + sz;
      b.onclick = () => { currentSize = sz; sizeWrap.querySelectorAll('.size').forEach((n) => n.classList.remove('is-active')); b.classList.add('is-active'); };
      sizeWrap.appendChild(b);
    });
    product.classList.remove('is-hidden');
  }
  function hideProduct() { product.classList.add('is-hidden'); }
  $('#productClose').onclick = hideProduct;

  function retintShoe(shoe, hex) {
    if (shoe && shoe.userData && shoe.userData.upperMat) shoe.userData.upperMat.color.set(hex);
  }

  // ---- cart ----
  const cartPanel = $('#cartPanel');
  function addToCart(data, color, size) {
    cart.push({ name: data.product.name, cat: data.category.title, price: data.product.price, color: data.product.colors[color], size });
    renderCart(); bumpCount(); showToast(`${data.product.name} added to your bag`);
    ctx.audio.tick();
  }
  function bumpCount() {
    const el = $('#cartCount'); el.textContent = cart.length;
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }
  function renderCart() {
    const wrap = $('#cartItems');
    if (!cart.length) { wrap.innerHTML = '<p class="cart__empty">Your bag is quietly waiting.<br>Hover a shoe and add it to begin.</p>'; }
    else {
      wrap.innerHTML = '';
      cart.forEach((it, i) => {
        const row = document.createElement('div'); row.className = 'citem';
        row.innerHTML = `
          <span class="citem__dot" style="background:${it.color}"></span>
          <div class="citem__body">
            <div class="citem__name">${it.name}</div>
            <div class="citem__meta">${it.cat} · UK ${it.size}</div>
            <button class="citem__rm" data-i="${i}">Remove</button>
          </div>
          <div class="citem__price">$${it.price}</div>`;
        wrap.appendChild(row);
      });
      wrap.querySelectorAll('.citem__rm').forEach((b) => b.onclick = () => { cart.splice(+b.dataset.i, 1); renderCart(); bumpCount(); });
    }
    const total = cart.reduce((s, i) => s + i.price, 0);
    $('#cartTotal').textContent = '$' + total.toLocaleString();
  }
  function openCart() { renderCart(); cartPanel.classList.add('is-open'); }
  function closeCart() { cartPanel.classList.remove('is-open'); }
  $('#cartBtn').onclick = openCart;
  $('#cartClose').onclick = closeCart;
  $('#cartScrim').onclick = closeCart;
  $('#checkoutBtn').onclick = () => { if (!cart.length) return showToast('Add a pair first'); showToast('Checkout is a demo — thank you for visiting Toasty Toes'); };

  // ---- quick view ----
  const quick = $('#quickPanel');
  function openQuick() {
    if (!current) return;
    $('#qEyebrow').textContent = current.category.title;
    $('#qName').textContent = current.product.name;
    $('#qDesc').textContent = current.product.desc;
    $('#qPrice').textContent = '$' + current.product.price;
    quick.classList.add('is-open');
  }
  function closeQuick() { quick.classList.remove('is-open'); }
  $('#quickView').onclick = openQuick;
  $('#quickClose').onclick = closeQuick;
  $('#quickScrim').onclick = closeQuick;
  $('#qAdd').onclick = () => { if (current) { addToCart(current, currentColor, currentSize); closeQuick(); } };
  $('#addCart').onclick = () => { if (current) addToCart(current, currentColor, currentSize); };

  // ---- chips ----
  function buildChips(onSelect) {
    const wrap = $('#chips'); wrap.innerHTML = '';
    CATEGORIES.forEach((c, i) => {
      const b = document.createElement('button');
      b.className = 'chip'; b.textContent = c.title; b.dataset.i = i;
      b.onclick = () => onSelect(i);
      wrap.appendChild(b);
    });
  }
  function setActiveChip(index) {
    document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', +c.dataset.i === index));
  }

  // ---- sound button ----
  const soundBtn = $('#soundBtn');
  soundBtn.onclick = () => { const on = ctx.audio.toggle(); soundBtn.classList.toggle('is-on', on); soundBtn.classList.toggle('is-off', !on); };

  return {
    showToast,
    moveCursor(x, y) { tx = x; ty = y; },
    setHot(hot) { cursor.classList.toggle('is-hot', hot); },
    showProduct, hideProduct,
    addToCart,
    openCart, closeCart,
    buildChips, setActiveChip,
    revealStoreUI() {
      soundBtn.classList.remove('is-hidden'); soundBtn.classList.add('is-on');
    },
  };
}
