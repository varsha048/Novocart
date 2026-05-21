// cart.js - Global cart handling and Cart Page logic

function getCartItems() {
    const items = localStorage.getItem('novaCart_items');
    return items ? JSON.parse(items) : [];
}

function saveCartItems(items) {
    localStorage.setItem('novaCart_items', JSON.stringify(items));
}

function getCartCount() {
    const items = getCartItems();
    return items.reduce((total, item) => total + item.quantity, 0);
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = getCartCount();
    
    badges.forEach(badge => {
        badge.innerText = count;
        
        // Small animation
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 200);
    });
}

function addToCartGlobal(product) {
    const items = getCartItems();
    
    // Check if product already in cart
    const existingItemIndex = items.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
        items[existingItemIndex].quantity += 1;
    } else {
        items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCartItems(items);
    updateCartBadge();
}

// ----------------------------------------------------
// Cart Page Specific Logic
// ----------------------------------------------------

function renderCartPage() {
    const cartContainer = document.getElementById('cart-items-container');
    if (!cartContainer) return; // Not on the cart page

    const items = getCartItems();
    const emptyState = document.getElementById('empty-cart-state');
    const cartContent = document.getElementById('cart-content');
    const cartItemCount = document.getElementById('cart-item-count');

    // Update count in header
    const totalItems = getCartCount();
    cartItemCount.innerText = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

    if (items.length === 0) {
        cartContent.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    } else {
        cartContent.style.display = 'flex';
        emptyState.style.display = 'none';
    }

    cartContainer.innerHTML = '';
    let subtotal = 0;

    items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn" onclick="removeCartItem(${item.id})">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <input type="text" class="qty-input" value="${item.quantity}" readonly>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
        cartContainer.appendChild(itemEl);
    });

    updateOrderSummary(subtotal);
}

function updateOrderSummary(subtotal) {
    const shipping = 5.00;
    const tax = subtotal * 0.08; // 8% dummy tax
    const total = subtotal + shipping + tax;

    document.getElementById('summary-subtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('summary-shipping').innerText = `$${shipping.toFixed(2)}`;
    document.getElementById('summary-tax').innerText = `$${tax.toFixed(2)}`;
    document.getElementById('summary-total').innerText = `$${total.toFixed(2)}`;
}

function updateQuantity(productId, change) {
    const items = getCartItems();
    const itemIndex = items.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        items[itemIndex].quantity += change;
        
        // Remove item if quantity drops to 0
        if (items[itemIndex].quantity <= 0) {
            items.splice(itemIndex, 1);
        }
        
        saveCartItems(items);
        updateCartBadge();
        renderCartPage();
    }
}

function removeCartItem(productId) {
    let items = getCartItems();
    items = items.filter(item => item.id !== productId);
    saveCartItems(items);
    updateCartBadge();
    renderCartPage();
}

// Make cart buttons navigate to cart page if they are buttons without links
function setupCartNavigation() {
    const cartBtns = document.querySelectorAll('.cart-btn');
    cartBtns.forEach(btn => {
        // If it's not a link and doesn't have onclick, add redirect
        if (btn.tagName !== 'A' && !btn.getAttribute('onclick')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'cart.html';
            });
        }
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    setupCartNavigation();
    renderCartPage(); // Will only run fully if on cart.html
});
