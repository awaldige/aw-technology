document.addEventListener('DOMContentLoaded', () => {
    // --- Referências de UI ---
    const productGrid = document.getElementById('product-grid');
    const cartCountElements = [
        document.getElementById('cart-count'), 
        document.getElementById('cart-count-mobile'),
        document.getElementById('cart-count-mobile-trigger')
    ].filter(el => el !== null); 
    
    let currentPage = 1;
    const productsPerPage = 9;

    // Elementos do Carrinho e Menu
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

    // --- 0. Funções de Auxílio ---
    window.socialDemo = (rede) => {
        alert(`🚀 MODO DEMONSTRAÇÃO: O link para o ${rede} está configurado corretamente.`);
    };

    const checkAdminVisibility = () => {
        const isAdmin = localStorage.getItem('aw_admin_auth') === 'true';
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.setProperty('display', isAdmin ? 'block' : 'none', 'important');
        });
    };

    // Atalho ADM (5 cliques na logo)
    let logoClicks = 0;
    const logo = document.querySelector('h1'); 
    if (logo) {
        logo.addEventListener('click', () => {
            logoClicks++;
            if (logoClicks === 5) { window.location.href = 'login.html'; }
            setTimeout(() => { logoClicks = 0; }, 3000); 
        });
    }

    // --- 1. Banco de Dados com Sincronização Inteligente ---
    const loadProducts = () => {
        const defaultProducts = [
            { id: 101, name: "HD WD Purple Surveillance 6TB 3.5\"", price: 1229, image: "https://m.media-amazon.com/images/I/71Od7Xf5SwL._AC_UL320_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos." },
            { id: 102, name: "Placa de Vídeo Inno3d RTX 5070", price: 6300, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400", description: "Desempenho de próxima geração para setups de ultra-performance." },
            { id: 103, name: "Kit Upgrade i9-14900K + B760M", price: 5200, image: "https://images.unsplash.com/photo-1591405351990-4726e33df58d?auto=format&fit=crop&q=80&w=400", description: "O coração do seu setup. Máximo poder de processamento." },
            { id: 104, name: "HD Externo Expansion Seagate 4TB", price: 1300, image: "https://m.media-amazon.com/images/I/81tjLksKixL._AC_SL1500_.jpg", description: "Espaço de sobra para seus projetos e games." },
            { id: 105, name: "ASUS ROG Strix RTX 4090", price: 13350, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400", description: "A rainha das GPUs. Performance sem compromissos." },
            { id: 106, name: "MSI Gaming Slim RTX 4070 Ti Super", price: 8200, image: "https://m.media-amazon.com/images/I/71R2oIsc9HL._AC_SL1500_.jpg", description: "Potência em formato slim para gabinetes compactos." },
            { id: 107, name: "AMD Ryzen 7 7800X3D", price: 2250, image: "https://m.media-amazon.com/images/I/51fS8rT9uWL._AC_SL1000_.jpg", description: "A melhor CPU para jogos do mundo." },
            { id: 108, name: "Intel Core i7-14700K", price: 2800, image: "https://m.media-amazon.com/images/I/61Sno74HAnL._AC_SL1200_.jpg", description: "Equilíbrio perfeito entre produtividade e jogos." },
            { id: 109, name: "Corsair Dominator Titanium DDR5", price: 2220, image: "https://m.media-amazon.com/images/I/71+v8O6NgeL._AC_SL1500_.jpg", description: "Memória de elite com estética insuperável." },
            { id: 110, name: "SSD Samsung 990 Pro 2TB", price: 3300, image: "https://m.media-amazon.com/images/I/61p-K8u+e9L._AC_SL1500_.jpg", description: "Velocidade de leitura absurda para tempos de loading zero." },
            { id: 111, name: "Water Cooler Kraken Elite 360", price: 2250, image: "https://m.media-amazon.com/images/I/71XG83O50KL._AC_SL1500_.jpg", description: "Refrigeração premium com tela LCD customizável." },
            { id: 112, name: "Lian Li Uni Fan SL-LCD 120", price: 352, image: "https://m.media-amazon.com/images/I/61Uv5vVq14L._AC_SL1500_.jpg", description: "Fans de alta performance com telas LCD integradas." },
            { id: 113, name: "Gabinete Hyte Y70 Touch Infinite", price: 3920, image: "https://m.media-amazon.com/images/I/71Zp+T+f2vL._AC_SL1500_.jpg", description: "Gabinete panorâmico com tela touch 4K integrada." },
            { id: 114, name: "Lian Li O11 Vision Compact", price: 1280, image: "https://m.media-amazon.com/images/I/61R-8C9F-5L._AC_SL1500_.jpg", description: "Design visionário com três vidros temperados." },
            { id: 115, name: "Water Cooler MSI MAG Coreliquid", price: 920, image: "https://m.media-amazon.com/images/I/61qYF8Y0f2L._AC_SL1500_.jpg", description: "Estética clean em branco com refrigeração eficiente." },
            { id: 116, name: "Gabinete Lian Li PC-O11 Dynamic XL", price: 1800, image: "https://m.media-amazon.com/images/I/71Zp+T+f2vL._AC_SL1500_.jpg", description: "O clássico dos entusiastas em versão estendida." },
            { id: 117, name: "Fonte Corsair RM1000x Shift", price: 1450, image: "https://m.media-amazon.com/images/I/718V3S-K0AL._AC_SL1500_.jpg", description: "Energia estável e limpa com cabos laterais inovadores." },
            { id: 118, name: "Teclado Custom Mecânico Elite", price: 1200, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400", description: "Experiência de digitação única para setups high-end." }
        ];

        const CURRENT_VERSION = "14.2"; // Versão atualizada para forçar refresh
        const savedVersion = localStorage.getItem('aw_db_version');

        if (savedVersion !== CURRENT_VERSION) {
            localStorage.setItem('aw_products', JSON.stringify(defaultProducts));
            localStorage.setItem('aw_db_version', CURRENT_VERSION);
            return defaultProducts;
        }

        try {
            const saved = localStorage.getItem('aw_products');
            return saved ? JSON.parse(saved) : defaultProducts;
        } catch (e) {
            return defaultProducts;
        }
    };

    let cart = JSON.parse(localStorage.getItem('aw_cart')) || [];

    // --- 2. Lógica do Carrinho ---
    const updateCartUI = () => {
        cartCountElements.forEach(el => { if (el) el.innerText = cart.length; });
        localStorage.setItem('aw_cart', JSON.stringify(cart));
        renderCartItems();
    };

    const renderCartItems = () => {
        if (!cartItemsContainer) return;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center mt-10">Carrinho vazio.</p>';
            cartTotalElement.innerText = 'R$ 0,00';
            return;
        }
        let total = 0;
        cartItemsContainer.innerHTML = cart.map((item, index) => {
            const price = Number(item.price) || 0;
            total += price;
            return `
                <div class="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700">
                    <img src="${item.image}" referrerpolicy="no-referrer" class="w-14 h-14 rounded-lg object-contain bg-white p-1" onerror="this.src='https://placehold.co/100x100/1f2937/white?text=IMG'">
                    <div class="flex-1 min-w-0">
                        <h4 class="text-xs font-bold truncate">${item.name}</h4>
                        <p class="text-blue-400 font-bold text-sm">R$ ${price.toLocaleString('pt-br')}</p>
                    </div>
                    <button onclick="removeFromCart(${index})" class="text-gray-500 hover:text-red-500 p-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                </div>
            `;
        }).join('');
        cartTotalElement.innerText = `R$ ${total.toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
    };

    window.addToCart = (id) => {
        const products = loadProducts();
        const product = products.find(p => p.id == id);
        if (product) {
            cart.push(product);
            updateCartUI();
            if (cartSidebar?.classList.contains('translate-x-full')) toggleCart();
        }
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    const toggleCart = () => {
        cartSidebar?.classList.toggle('translate-x-full');
        menuOverlay?.classList.toggle('hidden');
        document.body.classList.toggle('no-scroll');
    };

    // --- 3. Renderização de Produtos (CORREÇÃO DE IMAGEM AQUI) ---
    const renderProducts = () => {
        if (!productGrid) return;
        const products = loadProducts();
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const currentProducts = products.slice(start, end);

        productGrid.innerHTML = currentProducts.map(p => `
            <div class="card-premium bg-gray-800 p-4 rounded-2xl border border-gray-700 flex flex-col h-full group">
                <div class="product-img-container rounded-xl mb-4 relative overflow-hidden bg-white">
                    <img 
                        src="${p.image}" 
                        referrerpolicy="no-referrer" 
                        loading="eager"
                        class="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                        onerror="this.src='https://placehold.co/400x400/1f2937/white?text=AW+TECH'"
                    >
                </div>
                <h4 class="text-lg font-bold mb-2 min-h-[3rem] line-clamp-2">${p.name}</h4>
                <p class="text-gray-400 text-xs mb-4 line-clamp-3 flex-grow">${p.description}</p>
                <div class="flex flex-col gap-3 mt-auto pt-4 border-t border-gray-700/50">
                    <span class="text-xl font-black text-blue-400">R$ ${Number(p.price).toLocaleString('pt-br', { minimumFractionDigits: 2 })}</span>
                    <button onclick="addToCart(${p.id})" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `).join('');

        renderPagination(products.length);
        initScrollReveal();
    };

    const renderPagination = (total) => {
        const pages = Math.ceil(total / productsPerPage);
        const container = document.getElementById('pagination-container');
        if (!container) return;
        container.innerHTML = pages > 1 ? Array.from({ length: pages }, (_, i) => `
            <button onclick="changePage(${i + 1})" class="w-10 h-10 rounded-lg font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500 hover:bg-gray-700'}">${i+1}</button>
        `).join('') : '';
    };

    window.changePage = (page) => {
        currentPage = page;
        renderProducts();
        window.scrollTo({ top: document.getElementById('product-grid-section').offsetTop - 100, behavior: 'smooth' });
    };

    // --- 4. Eventos e Inicialização ---
    cartBtn?.addEventListener('click', toggleCart);
    cartBtnMobileTrigger?.addEventListener('click', toggleCart);
    closeCart?.addEventListener('click', toggleCart);
    
    menuBtn?.addEventListener('click', () => {
        mobileMenu?.classList.remove('translate-x-full');
        menuOverlay?.classList.remove('hidden');
        document.body.classList.add('no-scroll');
    });

    const closeAll = () => {
        mobileMenu?.classList.add('translate-x-full');
        cartSidebar?.classList.add('translate-x-full');
        menuOverlay?.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    };

    closeMenu?.addEventListener('click', closeAll);
    menuOverlay?.addEventListener('click', closeAll);

    checkoutBtn?.addEventListener('click', () => {
        if (cart.length === 0) return alert("Carrinho vazio!");
        const msg = encodeURIComponent(`🚀 *NOVO PEDIDO - AW TECHNOLOGY*\n\n${cart.map(i => `📦 *${i.name}*`).join('\n')}\n\n💰 *TOTAL: R$ ${cart.reduce((a,b) => a + Number(b.price), 0).toLocaleString('pt-br')}*`);
        window.open(`https://wa.me/5511985878638?text=${msg}`, '_blank');
    });

    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-4');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.card-premium').forEach(card => {
            card.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700');
            observer.observe(card);
        });
    }

    checkAdminVisibility();
    renderProducts();
    updateCartUI();
});
