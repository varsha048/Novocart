let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 10;
let cartCount = 0;

// Initialize the app
async function init() {
    try {
        const response = await fetch('https://cdn.jsdelivr.net/gh/adarshahelvar/NovaCart/products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        
        updateView();
    } catch (error) {
        console.error('Failed to fetch products:', error);
        document.getElementById('product-grid').innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <p>Failed to load products. Please check your connection and try again later.</p>
            </div>
        `;
    }
}

// Render the current page of products
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <p>No products found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <div class="product-meta">
                    <span class="category-badge">${product.category}</span>
                    <span class="product-rating">
                        <i class="fa-solid fa-star"></i>
                        ${product.rating.toFixed(1)}
                    </span>
                </div>
                <h3 class="product-title" title="${product.name}">${product.name}</h3>
                <p class="product-desc" title="${product.description}">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart()">
                        <i class="fa-solid fa-bag-shopping"></i> Add
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Render pagination controls
function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerText = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updateViewAndScroll();
        }
    };
    pagination.appendChild(prevBtn);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        // Show max 5 page numbers (for simplicity, assuming not more than a few pages based on 50 products)
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${currentPage === i ? 'active' : ''}`;
        pageBtn.innerText = i;
        pageBtn.onclick = () => {
            currentPage = i;
            updateViewAndScroll();
        };
        pagination.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerText = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateViewAndScroll();
        }
    };
    pagination.appendChild(nextBtn);
}

// Update the product count text
function updateProductCount() {
    const countElement = document.getElementById('product-count');
    const total = filteredProducts.length;
    
    if (total === 0) {
        countElement.innerText = 'Showing 0 products';
        return;
    }
    
    const startIndex = (currentPage - 1) * productsPerPage + 1;
    const endIndex = Math.min(startIndex + productsPerPage - 1, total);
    
    countElement.innerText = `Showing ${startIndex}-${endIndex} of ${total} products`;
}

// Update everything
function updateView() {
    renderProducts();
    renderPagination();
    updateProductCount();
}

function updateViewAndScroll() {
    updateView();
    // Scroll to products header
    const offsetTop = document.querySelector('.products-header').offsetTop - 100;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
}

// Apply Category Filter and Sort
function applyFiltersAndSort() {
    const category = document.getElementById('category-filter').value;
    const sort = document.getElementById('sort-filter').value;
    
    // Filter
    if (category === 'all') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(p => p.category === category);
    }
    
    // Sort
    switch (sort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'featured':
        default:
            filteredProducts.sort((a, b) => a.id - b.id);
            break;
    }
    
    currentPage = 1;
    updateView();
}

// Handle Add to Cart
function addToCart() {
    cartCount++;
    const badge = document.querySelector('.cart-badge');
    badge.innerText = cartCount;
    
    // Small animation for feedback
    badge.style.transform = 'scale(1.2)';
    setTimeout(() => {
        badge.style.transform = 'scale(1)';
    }, 200);
}

// Set up event listeners on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    init();
    
    document.getElementById('category-filter').addEventListener('change', applyFiltersAndSort);
    document.getElementById('sort-filter').addEventListener('change', applyFiltersAndSort);
});
