document.addEventListener('DOMContentLoaded', () => {

    const productGrid = document.getElementById('product-grid');

    const cartCountElements = [
        document.getElementById('cart-count'), 
        document.getElementById('cart-count-mobile')
    ];

    let currentPage = 1;
    const productsPerPage = 9;

    const cartSidebar = document.getElementById('cart-sidebar');
    const cartBtn = document.getElementById('cart-btn');
    const cartBtnMobileTrigger = document.getElementById('cart-btn-mobile-trigger');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const menuOverlay = document.getElementById('menu-overlay');

    window.socialDemo = (rede) => {
        alert(`🚀 MODO DEMONSTRAÇÃO: ${rede}`);
    };

    const checkAdminVisibility = () => {
        const isAdmin = localStorage.getItem('aw_admin_auth') === 'true';
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.setProperty('display', isAdmin ? 'block' : 'none', 'important');
        });
    };

    // 🔥 PRODUTOS COM IMAGENS ESTÁVEIS
    const loadProducts = () => {
        return [
            {
                id: 101,
                name: "HD WD Purple 6TB",
                price: 1229,
                image: "https://m.media-amazon.com/images/I/81S2Wb17P4L._AC_SL1500_.jpg",
                description: "Armazenamento de alta confiabilidade para vigilância."
            },
            {
                id: 102,
                name: "RTX 4070 Ti Super",
                price: 8200,
                image: "https://m.media-amazon.com/images/I/71R2oIsc9HL._AC_SL1500_.jpg",
                description: "Desempenho extremo para jogos e criação."
            },
            {
                id: 103,
                name: "Ryzen 7 7800X3D",
                price: 2250,
                image: "https://m.media-amazon.com/images/I/51fS8rT9uWL._AC_SL1000_.jpg",
                description: "Processador líder em performance para games."
            },
            {
                id: 104,
                name: "SSD Samsung 990 Pro 2TB",
                price: 3300,
                image: "https://m.media-amazon.com/images/I/61p-K8u+e9L._AC_SL1500_.jpg",
                description: "Velocidade absurda de leitura e gravação."
            }
        ];
    };

    let cart = JSON.parse(localStorage.getItem('aw_cart')) || [];

    const toggleCart = () => {
        cartSidebar.classList.toggle('translate-x-full');
        menuOverlay.classList.toggle('hidden');
        document.body.classList.toggle('no-scroll');
    };

    const renderCartItems = () => {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center">Carrinho vazio</p>';
            cartTotalElement.innerText = 'R$ 0,00';
            return;
        }

        let total = 0;

        cartItemsContainer.innerHTML = cart.map((item, index) => {
            total += item.price;

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

        cartTotalElement.innerText = `R$ ${total}`;
    };

    const updateCartUI = () => {
        cartCountElements.forEach(el => el.innerText = cart.length);
        localStorage.setItem('aw_cart', JSON.stringify(cart));
        renderCartItems();
    };

    window.addToCart = (id) => {
        const product = loadProducts().find(p => p.id == id);
        cart.push(product);
        updateCartUI();
        toggleCart();
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    // 🔥 RENDER PRODUTOS COM CORREÇÃO MOBILE
    const renderProducts = () => {
        const products = loadProducts();

        productGrid.innerHTML = products.map(product => `
            <div class="card-premium bg-gray-800 p-4 rounded-xl flex flex-col">

                <div class="product-img-container">
                    <img 
                        src="${product.image}" 
                        loading="lazy"
                        referrerpolicy="no-referrer"
                        class="w-full h-full object-contain"
                        onerror="
                            this.onerror=null;
                            this.src='https://placehold.co/400x400/1f2937/white?text=Sem+Imagem';
                        "
                    >
                </div>

                <h4 class="font-bold mt-3">${product.name}</h4>
                <p class="text-gray-400 text-sm">${product.description}</p>

                <span class="text-blue-400 font-bold mt-2">
                    R$ ${product.price}
                </span>

                <button onclick="addToCart(${product.id})"
                        class="bg-blue-600 mt-3 py-2 rounded">
                    Adicionar
                </button>
            </div>
        `).join('');
    };

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return alert("Carrinho vazio!");

        let msg = "Pedido:\n";
        cart.forEach(i => msg += i.name + "\n");

        window.open(`https://wa.me/5511985878638?text=${encodeURIComponent(msg)}`);
    });

    cartBtn.addEventListener('click', toggleCart);
    cartBtnMobileTrigger.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);

    renderProducts();
    updateCartUI();
    checkAdminVisibility();
});
