// WISTERIA — script.js
const products = [
  {
    id: 'p1', title: 'Pearl Drop Necklace', category:'jewellery', price: 2499,
    desc: 'Elegant freshwater pearl necklace, rhodium plated.',
    img: 'assets/product1.svg'
  },
  {
    id: 'p2', title: 'Rose Gold Hoops', category:'jewellery', price: 1799,
    desc: 'Lightweight rose gold plated hoops.',
    img: 'assets/product2.svg'
  },
  {
    id: 'p3', title: 'Velvet Matte Lipstick', category:'cosmetics', price: 799,
    desc: 'Long-wear, hydrating velvet matte finish.',
    img: 'assets/product3.svg'
  },
  {
    id: 'p4', title: 'Saffron Body Serum', category:'cosmetics', price: 1299,
    desc: 'Glow-boosting body serum with saffron extract.',
    img: 'assets/product4.svg'
  },
  {
    id: 'p5', title: 'Moonstone Ring', category:'jewellery', price: 3499,
    desc: 'Handcrafted moonstone set in sterling silver.',
    img: 'assets/product5.svg'
  },
  {
    id: 'p6', title: 'Hydra Mist Toner', category:'cosmetics', price: 599,
    desc: 'Refreshing toner with rose water and glycerin.',
    img: 'assets/product6.svg'
  }
];

const el = selector => document.querySelector(selector);
const els = selector => Array.from(document.querySelectorAll(selector));

const catalog = el('#catalog');
const cartButton = el('#cartButton');
const cartDrawer = el('#cartDrawer');
const closeCart = el('#closeCart');
const cartItemsWrap = el('#cartItems');
const cartCount = el('#cartCount');
const cartTotal = el('#cartTotal');
const checkoutBtn = el('#checkoutBtn');
const yearEl = el('#year');
const searchToggle = el('#searchToggle');
const searchWrap = el('#searchWrap');
const searchInput = el('#searchInput');
const categoryFilter = el('#categoryFilter');
const sortSelect = el('#sortSelect');
const productModal = el('#productModal');
const modalBody = el('#modalBody');
const closeModal = el('#closeModal');
const menuToggle = el('#menuToggle');
const themeToggle = el('#themeToggle');

let cart = JSON.parse(localStorage.getItem('wisteria_cart')||'[]');

function formatINR(n){ return '₹' + n.toLocaleString('en-IN'); }

function saveCart(){ localStorage.setItem('wisteria_cart', JSON.stringify(cart)); updateCartUI(); }

function addToCart(productId, qty=1){
  const p = products.find(x=>x.id===productId);
  if(!p) return;
  const existing = cart.find(i=>i.id===productId);
  if(existing) existing.qty += qty;
  else cart.push({id:productId, qty});
  saveCart();
  flashCart();
}

function removeFromCart(productId){
  cart = cart.filter(i=>i.id!==productId);
  saveCart();
}

function changeQty(productId, qty){
  const item = cart.find(i=>i.id===productId);
  if(!item) return;
  item.qty = qty;
  if(item.qty <= 0) removeFromCart(productId);
  saveCart();
}

function updateCartUI(){
  cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
  cartItemsWrap.innerHTML = '';
  let total = 0;
  if(cart.length===0){
    cartItemsWrap.innerHTML = '<div class="small">Your cart is empty.</div>';
  } else {
    cart.forEach(ci=>{
      const p = products.find(x=>x.id===ci.id);
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <strong>${p.title}</strong>
            <small class="small">${formatINR(p.price)}</small>
          </div>
          <div style="display:flex;gap:.5rem;align-items:center;margin-top:.45rem">
            <button class="icon-btn qty-minus" data-id="${p.id}">−</button>
            <span class="small qty-count">${ci.qty}</span>
            <button class="icon-btn qty-plus" data-id="${p.id}">+</button>
            <button class="icon-btn remove-item" data-id="${p.id}" style="margin-left:auto;color:#c33">Remove</button>
          </div>
        </div>
      `;
      cartItemsWrap.appendChild(row);
      total += p.price * ci.qty;
    });
  }
  cartTotal.textContent = formatINR(total);
}

function renderProducts(list){
  catalog.innerHTML = '';
  if(list.length===0){
    catalog.innerHTML = '<div class="small">No products found.</div>';
    return;
  }
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img loading="lazy" src="${p.img}" alt="${p.title}">
      <div>
        <div class="meta">
          <div>
            <h3 style="margin:.15rem 0">${p.title}</h3>
            <div class="small">${p.category}</div>
          </div>
          <div class="price">${formatINR(p.price)}</div>
        </div>
        <p class="small" aria-hidden="true">${p.desc}</p>
        <div class="actions">
          <button class="btn" data-id="${p.id}" data-action="view">View</button>
          <button class="btn primary" data-id="${p.id}" data-action="add">Add to cart</button>
        </div>
      </div>
    `;
    catalog.appendChild(card);
  });
}

function openCart(){ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); }
function closeCartFn(){ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); }

function flashCart(){
  cartButton.animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}], {duration:300});
}

function openModal(product){
  modalBody.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;align-items:start">
      <div>
        <img src="${product.img}" alt="${product.title}" style="width:100%;border-radius:10px;max-height:420px;object-fit:cover">
      </div>
      <div>
        <h2>${product.title}</h2>
        <div class="small">${product.category}</div>
        <p>${product.desc}</p>
        <div style="margin:1rem 0">
          <strong style="font-size:1.15rem">${formatINR(product.price)}</strong>
        </div>
        <div style="display:flex;gap:.5rem">
          <button id="modalAdd" class="btn primary">Add to cart</button>
          <button id="modalClose" class="btn">Close</button>
        </div>
      </div>
    </div>
  `;
  productModal.hidden = false;
  productModal.scrollTop = 0;
  productModal.focus();
  el('#modalAdd').addEventListener('click', ()=>{
    addToCart(product.id,1);
    productModal.hidden = true;
  });
  el('#modalClose').addEventListener('click', ()=> productModal.hidden = true);
}

function applyFilters(){
  let list = [...products];
  const q = searchInput.value.trim().toLowerCase();
  if(q) list = list.filter(p=> (p.title + ' ' + p.desc + ' ' + p.category).toLowerCase().includes(q));
  const cat = categoryFilter.value;
  if(cat !== 'all') list = list.filter(p=>p.category === cat);
  const sort = sortSelect.value;
  if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
  if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
  renderProducts(list);
}

document.addEventListener('click', (e)=>{
  const addBtn = e.target.closest('[data-action="add"]');
  const viewBtn = e.target.closest('[data-action="view"]');
  if(addBtn){
    addToCart(addBtn.dataset.id, 1);
    return;
  }
  if(viewBtn){
    const p = products.find(x=>x.id===viewBtn.dataset.id);
    if(p) openModal(p);
    return;
  }
  if(e.target.matches('#cartButton') || e.target.closest('#cartButton')) openCart();
  if(e.target.matches('#closeCart') || e.target.closest('#closeCart')) closeCartFn();
  if(e.target.matches('.qty-plus')){ changeQty(e.target.dataset.id, cart.find(i=>i.id===e.target.dataset.id).qty + 1); }
  if(e.target.matches('.qty-minus')){ 
    const id = e.target.dataset.id;
    const item = cart.find(i=>i.id===id);
    if(item) changeQty(id, item.qty - 1);
  }
  if(e.target.matches('.remove-item')){ removeFromCart(e.target.dataset.id); }
});

searchToggle.addEventListener('click', ()=> {
  searchWrap.hidden = !searchWrap.hidden;
  if(!searchWrap.hidden) searchInput.focus();
});

searchInput.addEventListener('input', ()=> applyFilters());
categoryFilter.addEventListener('change', ()=> applyFilters());
sortSelect.addEventListener('change', ()=> applyFilters());

closeModal.addEventListener('click', ()=> productModal.hidden = true);
productModal.addEventListener('click', (e)=> { if(e.target === productModal) productModal.hidden = true; });

checkoutBtn.addEventListener('click', ()=> {
  if(cart.length===0){ alert('Your cart is empty.'); return; }
  alert('Checkout is a demo — connect a payment gateway for full flow.');
});

menuToggle.addEventListener('click', ()=> alert('Menu: Add links or custom nav here.'));

themeToggle.addEventListener('click', ()=> {
  const root = document.documentElement;
  if(root.style.getPropertyValue('--bg') === 'black'){
    root.style.removeProperty('--bg');
    document.body.style.background = '';
  } else {
    root.style.setProperty('--bg','black');
    document.body.style.background = 'linear-gradient(180deg,#0b0212,#11041b)';
    alert('Dark theme demo — style it as you prefer.');
  }
});

document.addEventListener('DOMContentLoaded', ()=>{
  yearEl.textContent = new Date().getFullYear();
  renderProducts(products);
  updateCartUI();
});