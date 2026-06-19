
// ===== PRODUCT DATA =====
const products = [
    { id: 1, name: "Margherita Pizza", category: "pizza", price: 399, emoji: "🍕" },
    { id: 2, name: "Pepperoni Pizza", category: "pizza", price: 499, emoji: "🍕" },
    { id: 3, name: "Chicken Burger", category: "burger", price: 299, emoji: "🍔" },
    { id: 4, name: "Cheese Burger", category: "burger", price: 349, emoji: "🍔" },
    { id: 5, name: "Chocolate Cake", category: "dessert", price: 199, emoji: "🍫" },
    { id: 6, name: "Ice Cream", category: "dessert", price: 149, emoji: "🍦" },
];

// ===== TEAM DATA =====
const team = [
    { name: "Ali Khan", role: "Head Chef", avatar: "👨‍🍳" },
    { name: "Sara Ahmed", role: "Manager", avatar: "👩‍💼" },
    { name: "Usman Ali", role: "Developer", avatar: "👨‍💻" },
];

// ===== CART =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(el => {
        if (el) el.textContent = count;
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// ===== ADD TO CART =====
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    showToast(`${product.emoji} ${product.name} added!`);
}

// ===== REMOVE FROM CART =====
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

// ===== UPDATE QUANTITY =====
function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCart();
        }
    }
}

// ===== CHECKOUT =====
function checkout() {
    if (cart.length === 0) {
        showToast('❌ Cart is empty!');
        return;
    }
    showToast('🎉 Order placed successfully!');
    cart = [];
    saveCart();
    renderCart();
}

// ===== RENDER PRODUCTS =====
function renderProducts(containerId, filter = 'all') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#aaa;">No products found</p>';
        return;
    }

    container.innerHTML = filtered.map(p => `
        <div class="product-card">
            <span class="emoji">${p.emoji}</span>
            <h3>${p.name}</h3>
            <p class="category">${p.category}</p>
            <p class="price">Rs.${p.price}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

// ===== RENDER CART =====
function renderCart() {
    const container = document.getElementById('cartItems');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Cart is empty</h3>
                <p>Browse our menu to add items</p>
                <a href="menu.html" class="btn-primary" style="display:inline-block;margin-top:1rem;">Browse Menu</a>
            </div>
        `;
        updateSummary();
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.emoji} ${item.name}</h4>
                <span>Rs.${item.price} x ${item.quantity}</span>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove" onclick="removeFromCart(${item.id})">✕</button>
            </div>
        </div>
    `).join('');

    updateSummary();
}

// ===== UPDATE SUMMARY =====
function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal > 0 ? 40 : 0;
    const total = subtotal + delivery;

    document.getElementById('subtotal').textContent = `Rs.${subtotal}`;
    document.getElementById('delivery').textContent = `Rs.${delivery}`;
    document.getElementById('total').textContent = `Rs.${total}`;
}

// ===== RENDER TEAM =====
function renderTeam() {
    const container = document.getElementById('teamGrid');
    if (!container) return;

    container.innerHTML = team.map(m => `
        <div class="team-card">
            <span class="avatar">${m.avatar}</span>
            <h4>${m.name}</h4>
            <p>${m.role}</p>
        </div>
    `).join('');
}

// ===== FILTERS =====
function initFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts('menuProducts', btn.dataset.filter);
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('📧 Message sent successfully!');
            form.reset();
        });
    }
}

// ===== MOBILE MENU =====
function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Home Page
    renderProducts('featuredProducts');
    
    // Menu Page
    renderProducts('menuProducts');
    initFilters();
    
    // Cart Page
    renderCart();
    
    // About Page
    renderTeam();
    
    // Contact Page
    initContactForm();
    
    // Update cart count
    updateCartCount();
});