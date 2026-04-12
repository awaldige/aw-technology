document.addEventListener('DOMContentLoaded', () => {

    // ========================
    // ELEMENTOS
    // ========================
    const productGrid = document.getElementById('product-grid');
    const cartCountElements = [
        document.getElementById('cart-count'),
        document.getElementById('cart-count-mobile')
    ];

    const cartSidebar = document.getElementById('cart-sidebar');
    const cartBtn = document.getElementById('cart-btn');
    const cartBtnMobileTrigger = document.getElementById('cart-btn-mobile-trigger');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const menuOverlay = document.getElementById('menu-overlay');

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-btn');

    let currentPage = 1;
    const productsPerPage = 9;

    // ========================
    // SOCIAL DEMO
    // ========================
    window.socialDemo = (rede) => {
        mostrarToast(`🚧 ${rede} em desenvolvimento`);
    };

    // ========================
    // PRODUTOS (ORIGINAL)
    // ========================
    const loadProducts = () => {
        const defaultProducts = JSON.parse(localStorage.getItem('aw_products'));

        if (defaultProducts) return defaultProducts;

        return [
            { id: 101, name: "HD WD Purple Surveillance 6TB", price: 1229, image: "https://m.media-amazon.com/images/I/81S2Wb17P4L._AC_SL1500_.jpg" },
            { id: 102, name: "RTX 5070", price: 6300, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400" },
            { id: 103, name: "Kit i9 14900K", price: 5200, image: "https://images.unsplash.com/photo-1591405351990-4726e33df58d?auto=format&fit=crop&q=80&w=400" },
            { id: 104, name: "HD Seagate 4TB", price: 1300, image: "https://m.media-amazon.com/images/I/81tjLksKixL._AC_SL1500_.jpg" },
            { id: 105, name: "RTX 4090", price: 13350, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400" },
            { id: 106, name: "RTX 4070 Ti", price: 8200, image: "https://m.media-amazon.com/images/I/71R2oIsc9HL._AC_SL1500_.jpg" },
            { id: 107, name: "Ryzen 7 7800X3D", price: 2250, image: "https://m.media-amazon.com/images/I/51fS8rT9uWL._AC_SL1000_.jpg" },
            { id: 108, name: "i7 14700K", price: 2800, image: "https://m.media-amazon.com/images/I/61Sno74HAnL._AC_SL1200_.jpg" },
            { id: 109, name: "Corsair DDR5", price: 2220, image: "https://m.media-amazon.com/images/I/71+v8O6NgeL._AC_SL1500_.jpg" },
            { id: 110, name: "SSD 990 Pro", price: 3300, image: "https://m.media-amazon.com/images/I/61p-K8u+e9L._AC_SL1500_.jpg" },
            { id: 111, name: "Kraken Elite", price: 2250, image: "https://m.media-amazon.com/images/I/71XG83O50KL._AC_SL1500_.jpg" },
            { id: 112, name: "Lian Li Fan", price: 352, image: "https://m.media-amazon.com/images/I/61Uv5vVq14L._AC_SL1500_.jpg" },
            { id: 113, name: "Hyte Y70", price: 3920, image: "https://m.media-amazon.com/images/I/71Zp+T+f2vL._AC_SL1500_.jpg" },
            { id: 114, name: "Lian Li O11", price: 1280, image: "https://m.media-amazon.com/images/I/61R-8C9F-5L._AC_SL1500_.jpg" },
            { id: 115, name: "Water Cooler MSI", price: 920, image: "https://m.media-amazon.com/images/I/61qYF8Y0f2L._AC_SL1500_.jpg" },
            { id: 116, name: "Gabinete XL", price: 1800, image: "https://m.media-amazon.com/images/I/71Zp+T+f2vL._AC_SL1500_.jpg" },
            { id: 117, name: "Fonte 1000W", price: 1450, image: "https://m.media-amazon.com/images/I/718V3S-K0AL._AC_SL1500_.jpg" },
            { id: 118, name: "Teclado Elite", price: 1200, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400" }
        ];
    };

    let products = loadProducts();
    let cart = JSON.parse(localStorage.getItem('aw_cart')) || [];

    // ========================
    // RENDER PRODUTOS
    // ========================
    const renderProducts = () => {
        const start = (currentPage - 1) * productsPerPage;
        const pageProducts = products.slice(start, start + productsPerPage);

        productGrid.innerHTML = pageProducts.map(p => `
            <div class="bg-gray-800 p-4 rounded-xl">
                <div class="product-img-container mb-4">
                    <img src="${p.image}" loading="lazy"
                        onerror="this.onerror=null;this.src='https://placehold.co/400x400'">
                </div>
                <h2 class="font-bold">${p.name}</h2>
                <p class="text-blue-400">R$ ${p.price}</p>
                <button onclick="addToCart(${p.id})" class="bg-blue-600 w-full mt-3 py-2 rounded">
                    Adicionar
                </button>
            </div>
        `).join('');
    };

    // ========================
    // CARRINHO
    // ========================
    window.addToCart = (id) => {
        const product = products.find(p => p.id == id);
        cart.push(product);
        localStorage.setItem('aw_cart', JSON.stringify(cart));
        updateCartUI();
        mostrarToast("🛒 Adicionado!");
    };

    const updateCartUI = () => {
        cartCountElements.forEach(el => el.innerText = cart.length);
    };

    // ========================
    // TOAST
    // ========================
    function mostrarToast(msg) {
        const t = document.createElement("div");
        t.innerText = msg;
        t.style.cssText = `
            position: fixed; bottom:20px; left:50%;
            transform:translateX(-50%);
            background:#111; color:#fff;
            padding:12px 20px; border-radius:10px;
            z-index:9999;
        `;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2500);
    }

    // ========================
    // INIT
    // ========================
    renderProducts();
    updateCartUI();
});
