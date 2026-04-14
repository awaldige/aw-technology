/** * AW TECHNOLOGY - VERCEL STABLE v8.0 
 * Full Integration: UI Controls + Cart + Pagination + Easter Egg
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS DA INTERFACE ---
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const cartBtn = document.getElementById('cart-btn');
    const cartBtnMobile = document.getElementById('cart-btn-mobile-trigger');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('menu-overlay');
    const logo = document.getElementById('admin-logo');

    // --- FUNÇÕES DE CONTROLE DE MENU ---
    const toggleMenu = (isOpen) => {
        mobileMenu.classList.toggle('translate-x-full', !isOpen);
        overlay.style.opacity = isOpen ? '1' : '0';
        overlay.style.pointerEvents = isOpen ? 'auto' : 'none';
    };

    const toggleCart = (isOpen) => {
        cartSidebar.classList.toggle('translate-x-full', !isOpen);
        overlay.style.opacity = isOpen ? '1' : '0';
        overlay.style.pointerEvents = isOpen ? 'auto' : 'none';
    };

    menuBtn?.addEventListener('click', () => toggleMenu(true));
    closeBtn?.addEventListener('click', () => toggleMenu(false));
    cartBtn?.addEventListener('click', () => toggleCart(true));
    cartBtnMobile?.addEventListener('click', () => toggleCart(true));
    closeCart?.addEventListener('click', () => toggleCart(false));
    overlay?.addEventListener('click', () => { toggleMenu(false); toggleCart(false); });

    // --- LOGIN OCULTO (5 TOQUES) ---
    let logoClicks = 0;
    let clickTimer;
    logo?.addEventListener('click', () => {
        logoClicks++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { logoClicks = 0; }, 3000);
        if (logoClicks >= 5) {
            logoClicks = 0;
            const pass = prompt("🔐 ADMIN ACCESS\nDigite a senha:");
            if (pass === "780606") window.location.href = "admin.html";
            else alert("Acesso Negado.");
        }
    });

    // --- RODAPÉ REATIVO ---
    window.socialDemo = (rede) => {
        alert(`🚀 MODO DEMONSTRAÇÃO: O link para o ${rede} está configurado.\nSimulação de redirecionamento AW Technology.`);
    };

    document.getElementById('insta-link')?.addEventListener('click', (e) => { e.preventDefault(); socialDemo('Instagram'); });
    document.getElementById('whats-link')?.addEventListener('click', (e) => { e.preventDefault(); socialDemo('WhatsApp'); });

    // --- CONFIGURAÇÃO DE PRODUTOS ---
    const productGrid = document.getElementById('product-grid');
    const paginationContainer = document.getElementById('pagination-container');
    let cart = JSON.parse(localStorage.getItem('aw_cart')) || [];
    let currentPage = 1;
    const productsPerPage = 9;

    const products = [
        { id: 101, name: "HD WD Purple Surveillance 6TB", price: 1229, image: "https://m.media-amazon.com/images/I/81S2Wb17P4L._AC_SL1500_.jpg", description: "Engenharia de elite para sistemas de segurança." },
        { id: 102, name: "Placa de Vídeo Inno3d RTX 5070", price: 6300, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400", description: "Desempenho de próxima geração." },
        { id: 103, name: "Kit Upgrade i9-14900K + B760M", price: 5200, image: "https://images.unsplash.com/photo-1591405351990-4726e33df58d?w=400", description: "O coração do seu setup." },
        { id: 104, name: "HD Externo Seagate 4TB", price: 1300, image: "https://m.media-amazon.com/images/I/81tjLksKixL._AC_SL1500_.jpg", description: "Espaço de sobra para seus projetos." },
        { id: 105, name: "ASUS ROG Strix RTX 4090", price: 13350, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400", description: "A rainha das GPUs." },
        { id: 106, name: "MSI Gaming Slim RTX 4070 Ti Super", price: 8200, image: "https://m.media-amazon.com/images/I/71R2oIsc9HL._AC_SL1500_.jpg", description: "Potência em formato slim." },
        { id: 107, name: "AMD Ryzen 7 7800X3D", price: 2250, image: "https://m.media-amazon.com/images/I/51fS8rT9uWL._AC_SL1000_.jpg", description: "A melhor CPU para jogos do mundo." },
        { id: 108, name: "Intel Core i7-14700K", price: 2800, image: "https://m.media-amazon.com/images/I/61Sno74HAnL._AC_SL1200_.jpg", description: "Equilíbrio perfeito entre trabalho e play." },
        { id: 109, name: "Corsair Dominator Titanium DDR5", price: 2220, image: "https://m.media-amazon.com/images/I/71+v8O6NgeL._AC_SL1500_.jpg", description: "Memória de elite com estética premium." },
        { id: 110, name: "SSD Samsung 990 Pro 2TB", price: 3300, image: "https://m.media-amazon.com/images/I/61p-K8u+e9L._AC_SL1500_.jpg", description: "Velocidade de leitura absurda." },
        { id: 111, name: "Water Cooler Kraken Elite 360", price: 2250, image: "https://m.media-amazon.com/images/I/71XG83O50KL._AC_SL1500_.jpg", description: "Refrigeração com tela LCD." },
        { id: 112, name: "Lian Li Uni Fan SL-LCD 120", price: 352, image: "https://m.media-amazon.com/images/I/61Uv5vVq14L._AC_SL1500_.jpg", description: "Fans com telas LCD integradas." },
        { id: 113, name: "Gabinete Hyte Y70 Touch Infinite", price: 3920, image: "https://m.media-amazon.com/images/I/71Zp+T+f2vL._AC_SL1500_.jpg", description: "Gabinete panorâmico com tela touch 4K." },
        { id: 114, name: "Lian Li O11 Vision Compact", price: 1280, image: "https://m.media-amazon.com/images/I/61R-8C9F-5L._AC_SL1500_.jpg", description: "Design visionário com três vidros." },
        { id: 115, name: "Water Cooler MSI MAG Coreliquid", price: 920, image: "https://m.media-amazon.com/images/I/61qYF8Y0f2L._AC_SL1500_.jpg", description: "Estética clean em branco." },
        { id: 116, name: "Gabinete Lian Li O11 Dynamic XL", price: 1800, image: "https://m.media-amazon.com/images/I/71Zp+T+f2vL._AC_SL1500_.jpg", description: "O clássico dos entusiastas." },
        { id: 117, name: "Fonte Corsair RM1000x Shift", price: 1450, image: "https://m.media-amazon.com/images/I/718V3S-K0AL._AC_SL1500_.jpg", description: "Energia estável cabos laterais." },
        { id: 118, name: "Teclado Custom Mecânico Elite", price: 1200, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400", description: "Experiência de digitação única." }
    ];

    window.renderProducts = () => {
        if (!productGrid) return;
        const start = (currentPage - 1) * productsPerPage;
        const items = products.slice(start, start + productsPerPage);

        productGrid.innerHTML = items.map(p => `
            <div class="card-premium bg-gray-800/40 p-5 rounded-2xl border border-gray-800 flex flex-col h-full group">
                <div class="product-img-container mb-5">
                    <img src="https://images.weserv.nl/?url=${encodeURIComponent(p.image)}&w=400" alt="${p.name}" onerror="this.src='https://placehold.co/400?text=Hardware'">
                </div>
                <h4 class="text-white font-bold mb-2 line-clamp-2">${p.name}</h4>
                <p class="text-gray-400 text-xs mb-5 line-clamp-2 leading-relaxed">${p.description}</p>
                <div class="mt-auto pt-5 border-t border-gray-700/50">
                    <span class="text-blue-400 text-2xl font-black block mb-4 italic">R$ ${p.price.toLocaleString('pt-br')}</span>
                    <button onclick="addToCart(${p.id})" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.97]">
                        Adicionar
                    </button>
                </div>
            </div>`).join('');
        renderPagination();
    };

    const renderPagination = () => {
        if (!paginationContainer) return;
        const total = Math.ceil(products.length / productsPerPage);
        paginationContainer.innerHTML = Array.from({ length: total }, (_, i) => `
            <button onclick="changePage(${i + 1})" class="w-11 h-11 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-800 text-gray-500 hover:bg-gray-700'}">
                ${i + 1}
            </button>`).join('');
    };

    window.changePage = (p) => { currentPage = p; renderProducts(); window.scrollTo({top: productGrid.offsetTop - 100, behavior: 'smooth'}); };

    window.addToCart = (id) => {
        const item = products.find(p => p.id == id);
        if (item) {
            cart.push(item);
            localStorage.setItem('aw_cart', JSON.stringify(cart));
            updateUI();
            toggleCart(true);
        }
    };

    window.removeFromCart = (i) => {
        cart.splice(i, 1);
        localStorage.setItem('aw_cart', JSON.stringify(cart));
        updateUI();
    };

    function updateUI() {
        document.querySelectorAll('#cart-count, #cart-count-mobile').forEach(c => c.innerText = cart.length);
        const total = cart.reduce((acc, i) => acc + i.price, 0);
        const totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.innerText = `R$ ${total.toLocaleString('pt-br')}`;
        
        const container = document.getElementById('cart-items');
        if (container) {
            container.innerHTML = cart.length ? cart.map((item, i) => `
                <div class="flex items-center gap-4 bg-gray-900/80 p-3 rounded-xl border border-gray-800">
                    <img src="${item.image}" class="w-12 h-12 object-contain bg-white/10 rounded-lg">
                    <div class="flex-1 min-w-0">
                        <p class="text-[11px] font-bold text-white truncate">${item.name}</p>
                        <p class="text-blue-400 text-xs font-bold">R$ ${item.price.toLocaleString('pt-br')}</p>
                    </div>
                    <button onclick="removeFromCart(${i})" class="text-gray-500 hover:text-red-500 p-2 transition-colors">✕</button>
                </div>`).join('') : '<p class="text-center text-gray-600 py-10 uppercase text-xs tracking-widest">Carrinho Vazio</p>';
        }
    }

    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        if (!cart.length) return alert("Carrinho vazio!");
        const total = cart.reduce((acc, i) => acc + i.price, 0);
        const msg = `Olá! Gostaria de encomendar:\n\n${cart.map(i => `• ${i.name}`).join('\n')}\n\n*Total: R$ ${total.toLocaleString('pt-br')}*`;
        window.open(`https://wa.me/5511985878638?text=${encodeURIComponent(msg)}`, '_blank');
    });

    renderProducts();
    updateUI();
});
