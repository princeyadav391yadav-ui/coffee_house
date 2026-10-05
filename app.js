const menuItems = [
    {id:1,name:'Cappuccino',price:180,cat:'Hot Coffee',img:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80',desc:'Rich espresso with steamed milk and soft foam.'},
    {id:2,name:'Latte',price:220,cat:'Hot Coffee',img:'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=500&q=80',desc:'Smooth espresso balanced with creamy steamed milk.'},
    {id:3,name:'Espresso',price:150,cat:'Hot Coffee',img:'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=500&q=80',desc:'Bold, concentrated coffee with a rich crema.'},
    {id:4,name:'Mocha',price:240,cat:'Specials',img:'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=500&q=80',desc:'Chocolate, espresso and milk for a sweet coffee treat.'},
    {id:5,name:'Cold Coffee',price:200,cat:'Cold Coffee',img:'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80',desc:'Chilled, creamy and refreshing coffee for every mood.'},
    {id:6,name:'Americano',price:170,cat:'Hot Coffee',img:'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=500&q=80',desc:'Espresso topped with hot water for a clean finish.'},
    {id:7,name:'Chocolate Frappe',price:260,cat:'Cold Coffee',img:'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80',desc:'Cold blended coffee with chocolate and whipped cream.'},
    {id:8,name:'Masala Chai',price:120,cat:'Tea & Snacks',img:'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=500&q=80',desc:'Indian spiced tea brewed fresh and served hot.'},
    {id:9,name:'Veg Sandwich',price:160,cat:'Tea & Snacks',img:'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80',desc:'Fresh vegetables, cheese and herbs in toasted bread.'}
  ];
  
  let cart = JSON.parse(localStorage.getItem('coffeeCart') || '[]');
  let currentUser = JSON.parse(localStorage.getItem('coffeeUser') || 'null');
  let orders = JSON.parse(localStorage.getItem('coffeeOrders') || '[]');
  let selectedCategory = 'All';
  
  const $ = s => document.querySelector(s);
  const money = n => `₹${n.toLocaleString('en-IN')}`;
  const save = () => { 
    localStorage.setItem('coffeeCart', JSON.stringify(cart)); 
    localStorage.setItem('coffeeOrders', JSON.stringify(orders)); 
    localStorage.setItem('coffeeUser', JSON.stringify(currentUser)); 
  };
  
  function renderMenu(){
    const q = ($('#menuSearch')?.value || '').toLowerCase();
    const list = menuItems.filter(i => (selectedCategory==='All'||i.cat===selectedCategory) && (i.name.toLowerCase().includes(q)||i.desc.toLowerCase().includes(q)));
    $('#menuBox').innerHTML = list.map(i => `
      <article class="card">
        <div class="card-img">
          <img src="${i.img}" alt="${i.name}" loading="lazy">
          <span class="badge">${i.cat}</span>
        </div>
        <div class="card-body">
          <h3>${i.name}</h3>
          <p>${i.desc}</p>
          <div class="card-bottom">
            <strong>${money(i.price)}</strong>
            <button class="add-btn" onclick="addToCart(${i.id})"><i class="fa-solid fa-plus"></i> Add</button>
          </div>
        </div>
      </article>
    `).join('') || '<p class="empty">No menu item found.</p>';
  }
  
  function renderCategories(){
    const cats=['All',...new Set(menuItems.map(i=>i.cat))];
    $('#categories').innerHTML=cats.map(c=>`<button class="filter-btn ${c===selectedCategory?'active':''}" onclick="filterMenu('${c}')">${c}</button>`).join('');
  }
  
  function filterMenu(c){selectedCategory=c;renderCategories();renderMenu();}
  
  function addToCart(id){
    const item=menuItems.find(x=>x.id===id), found=cart.find(x=>x.id===id);
    if(found) found.qty++; else cart.push({...item,qty:1});
    save(); renderCart(); toast(`${item.name} added to cart`);
  }
  
  function changeQty(id,d){
    const x=cart.find(i=>i.id===id);
    if(!x)return;
    x.qty+=d;
    if(x.qty<=0) cart=cart.filter(i=>i.id!==id);
    save(); renderCart();
  }
  
  function renderCart(){
    const count=cart.reduce((a,i)=>a+i.qty,0), subtotal=cart.reduce((a,i)=>a+i.price*i.qty,0), delivery=subtotal?40:0;
    $('#cartCount').textContent=count;
    $('#cartItems').innerHTML=cart.length?cart.map(i=>`
      <div class="cart-item">
        <img src="${i.img}" alt="${i.name}">
        <div>
          <h4>${i.name}</h4>
          <small>${money(i.price)} each</small>
          <div class="qty">
            <button onclick="changeQty(${i.id},-1)">−</button>
            <b>${i.qty}</b>
            <button onclick="changeQty(${i.id},1)">+</button>
          </div>
        </div>
        <strong>${money(i.price*i.qty)}</strong>
      </div>
    `).join('') : `
      <div class="empty-cart">
        <i class="fa-solid fa-mug-hot"></i>
        <p>Your cart is empty.</p>
        <small>Add something delicious from the menu.</small>
        <a href="#menu" class="btn primary" style="padding: 8px 18px; font-size: 12px; margin-top: 10px;" onclick="closePanels()">Explore Menu</a>
      </div>
    `;
    $('#subtotal').textContent=money(subtotal);
    $('#delivery').textContent=money(delivery);
    $('#total').textContent=money(subtotal+delivery);
    $('#checkoutBtn').disabled=!cart.length;
  }
  
  function openCart(){renderCart();$('#cartDrawer').classList.add('open');$('#overlay').classList.add('show');}
  function closePanels(){$('#cartDrawer').classList.remove('open');$('#loginModal').classList.remove('show');$('#checkoutModal').classList.remove('show');$('#orderModal').classList.remove('show');$('#overlay').classList.remove('show');}
  function openLogin(){closePanels();$('#loginModal').classList.add('show');$('#overlay').classList.add('show');}
  function openCheckout(){
    if(!cart.length) return toast('Your cart is empty'); 
    if(!currentUser){ openLogin(); toast('Please login before checkout'); return; } 
    closePanels(); renderCheckout(); $('#checkoutModal').classList.add('show'); $('#overlay').classList.add('show');
  }
  
  function renderCheckout(){
    const subtotal=cart.reduce((a,i)=>a+i.price*i.qty,0);
    $('#checkoutItems').innerHTML=cart.map(i=>`<div><span>${i.name} × ${i.qty}</span><b>${money(i.price*i.qty)}</b></div>`).join('');
    $('#checkoutTotal').textContent=money(subtotal+40);
  }
  
  function placeOrder(e){
    e.preventDefault();
    const form=new FormData(e.target);
    const subtotal=cart.reduce((a,i)=>a+i.price*i.qty,0);
    const order={
      id:'CH'+Date.now().toString().slice(-8),
      date:new Date().toLocaleString('en-IN'),
      customer:currentUser.name,
      phone:form.get('phone'),
      address:form.get('address'),
      payment:form.get('payment'),
      items:cart.map(i=>({name:i.name,qty:i.qty,price:i.price})),
      total:subtotal+40,
      status:'Confirmed'
    };
    orders.unshift(order); cart=[]; save(); e.target.reset(); closePanels(); renderCart(); renderOrders(); toast(`Order ${order.id} placed successfully!`); openOrders();
  }
  
  function openOrders(){closePanels();renderOrders();$('#orderModal').classList.add('show');$('#overlay').classList.add('show');}
  function renderOrders(){
    const mine=currentUser?orders.filter(o=>o.customer===currentUser.name):[];
    $('#ordersList').innerHTML=mine.length?mine.map(o=>`
      <div class="order-card">
        <div class="order-head">
          <div><strong>${o.id}</strong><small>${o.date}</small></div>
          <span class="status">${o.status}</span>
        </div>
        <div class="order-items">${o.items.map(i=>`${i.name} ×${i.qty}`).join(' • ')}</div>
        <div class="order-foot"><span>${o.payment}</span><strong>${money(o.total)}</strong></div>
      </div>
    `).join(''):'<div class="empty"><i class="fa-solid fa-receipt"></i><p>No orders yet.</p></div>';
  }
  
  function login(e){
    e.preventDefault();
    const f=new FormData(e.target);
    currentUser={name:f.get('name'),email:f.get('email')};
    save(); closePanels(); updateUserUI(); toast(`Welcome, ${currentUser.name}!`);
  }
  
  function register(e){
    e.preventDefault();
    const f=new FormData(e.target);
    currentUser={name:f.get('name'),email:f.get('email')};
    save(); closePanels(); updateUserUI(); toast('Account created successfully!');
  }
  
  function logout(){currentUser=null;save();updateUserUI();toast('You have been logged out');}
  function updateUserUI(){
    const b=$('#userBtn');
    b.innerHTML=currentUser?`<i class="fa-solid fa-user-check"></i><span>${currentUser.name.split(' ')[0]}</span>`:`<i class="fa-regular fa-user"></i><span>Login</span>`;
  }
  
  function switchAuth(type){
    $('#loginForm').classList.toggle('hidden',type!=='login');
    $('#registerForm').classList.toggle('hidden',type!=='register');
    $('#loginTab').classList.toggle('active',type==='login');
    $('#registerTab').classList.toggle('active',type==='register');
  }
  
  function toast(msg){
    const t=$('#toast');
    t.textContent=msg; t.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer=setTimeout(()=>t.classList.remove('show'),2600);
  }
  
  function toggleMenu(){$('#mobileMenu').classList.toggle('show');}
  function openUser(){
    if(currentUser){
      const ok=confirm(`Logged in as ${currentUser.name}.\nPress OK to view orders, Cancel to logout.`);
      if(ok) openOrders(); else logout();
    } else openLogin();
  }
  
  function setupActiveNavOnScroll(){
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (pageYOffset >= sectionTop) current = section.getAttribute('id');
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
      });
    });
  }
  
  function init(){
    renderCategories(); renderMenu(); renderCart(); updateUserUI(); renderOrders(); setupActiveNavOnScroll();
    $('#menuSearch').addEventListener('input',renderMenu);
    $('#year').textContent=new Date().getFullYear();
    document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>$('#mobileMenu').classList.remove('show')));
  }
  
  document.addEventListener('DOMContentLoaded',init);