document.addEventListener('DOMContentLoaded', () => {

    const productGrid = document.getElementById('product-grid');
    const paginationContainer = document.getElementById('pagination-container');

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

    // =========================
    // CONFIG PAGINAÇÃO
    // =========================
    let currentPage = 1;
    const productsPerPage = 9;

    // =========================
    // ADMIN VISIBILITY
    // =========================
    const checkAdminVisibility = () => {
        const isAdmin = localStorage.getItem('aw_admin_auth') === 'true';
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.setProperty('display', isAdmin ? 'block' : 'none', 'important');
        });
    };

    // =========================
    // PRODUTOS (LOCALSTORAGE)
    // =========================
    const loadProducts = () => {
        return JSON.parse(localStorage.getItem('aw_products')) || [];
    };

    // =========================
    // CART
    // =========================
    let cart = JSON.parse(localStorage.getItem('aw_cart')) || [];

    const toggleCart = () => {
        cartSidebar.classList.toggle('translate-x-full');
        menuOverlay.classList.toggle('hidden');
        document.body.classList.toggle('no-scroll');
    };

    const renderCartItems = () => {
        if (!cart.length) {
            cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center">Carrinho vazio</p>';
            cartTotalElement.innerText = 'R$ 0,00';
            return;
        }

        let total = 0;

        cartItemsContainer.innerHTML = cart.map((item, index) => {
            total += Number(item.price || 0);

            return `
                <div class="flex items-center gap-3 bg-gray-800 p-3 rounded-xl">
                    <img src="${item.image}" class="w-14 h-14 object-contain"
                         onerror="this.src='https://placehold.co/100x100?text=Erro'">

                    <div class="flex-1">
                        <h4 class="text-sm font-bold">${item.name}</h4>
                        <p class="text-blue-400">R$ ${item.price}</p>
                    </div>

                    <button onclick="removeFromCart(${index})">❌</button>
                </div>
            `;
        }).join('');

        cartTotalElement.innerText = `R$ ${total.toFixed(2)}`;
    };

    const updateCartUI = () => {
        cartCountElements.forEach(el => {
            if (el) el.innerText = cart.length;
        });

        localStorage.setItem('aw_cart', JSON.stringify(cart));
        renderCartItems();
    };

    window.addToCart = (id) => {
        const product = loadProducts().find(p => p.id == id);
        if (!product) return;

        cart.push(product);
        updateCartUI();
        toggleCart();
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    // =========================
    // RENDER PRODUTOS + PAGINAÇÃO
    // =========================
    const renderProducts = () => {
        const products = loadProducts();

        if (!productGrid) return;

        if (!products.length) {
            productGrid.innerHTML = `<p class="text-gray-400">Nenhum produto cadastrado.</p>`;
            paginationContainer.innerHTML = '';
            return;
        }

        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;

        const paginated = products.slice(start, end);

        productGrid.innerHTML = paginated.map(product => `
            <div class="card-premium bg-gray-800 p-4 rounded-xl flex flex-col">

                <div class="product-img-container">
                    <img 
                        src="${product.image}" 
                        loading="lazy"
                        class="w-full h-full object-contain"
                        onerror="this.onerror=null;this.src='https://placehold.co/400x400/1f2937/white?text=Sem+Imagem';"
                    >
                </div>

                <h4 class="font-bold mt-3">${product.name}</h4>
                <p class="text-gray-400 text-sm">${product.description || ''}</p>

                <span class="text-blue-400 font-bold mt-2">
                    R$ ${Number(product.price).toFixed(2)}
                </span>

                <button onclick="addToCart(${product.id})"
                        class="bg-blue-600 mt-3 py-2 rounded">
                    Adicionar
                </button>
            </div>
        `).join('');

        renderPagination(products.length);
    };

    // =========================
    // PAGINAÇÃO UI
    // =========================
    const renderPagination = (totalProducts) => {
        const totalPages = Math.ceil(totalProducts / productsPerPage);

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let buttons = '';

        buttons += `
            <button class="px-3 py-2 bg-gray-800 rounded" 
                onclick="changePage(${currentPage - 1})"
                ${currentPage === 1 ? 'disabled' : ''}>
                ◀
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            buttons += `
                <button class="px-3 py-2 rounded ${i === currentPage ? 'bg-blue-600' : 'bg-gray-800'}"
                    onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        }

        buttons += `
            <button class="px-3 py-2 bg-gray-800 rounded"
                onclick="changePage(${currentPage + 1})"
                ${currentPage === totalPages ? 'disabled' : ''}>
                ▶
            </button>
        `;

        paginationContainer.innerHTML = buttons;
    };

    window.changePage = (page) => {
        const products = loadProducts();
        const totalPages = Math.ceil(products.length / productsPerPage);

        if (page < 1 || page > totalPages) return;

        currentPage = page;
        renderProducts();
    };

    // =========================
    // CHECKOUT
    // =========================
    checkoutBtn.addEventListener('click', () => {
        if (!cart.length) return alert("Carrinho vazio!");

        let msg = "Pedido:\n";
        cart.forEach(i => msg += i.name + "\n");

        window.open(`https://wa.me/5511985878638?text=${encodeURIComponent(msg)}`);
    });

    // =========================
    // EVENTS
    // =========================
    cartBtn?.addEventListener('click', toggleCart);
    cartBtnMobileTrigger?.addEventListener('click', toggleCart);
    closeCart?.addEventListener('click', toggleCart);

    // =========================
    // INIT
    // =========================
    renderProducts();
    updateCartUI();
    checkAdminVisibility();
});
