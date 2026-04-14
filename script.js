/** * AW TECHNOLOGY - SCRIPT FINAL (VERCEL READY)
 * 1. Funções globais primeiro (Rodapé)
 * 2. Banco de dados completo (18 itens)
 * 3. Lógica de renderização e carrinho
 */

// --- 1. ESCOPO GLOBAL (Essencial para o onclick do HTML) ---
window.socialDemo = function(rede) {
    alert(`🚀 MODO DEMONSTRAÇÃO: O link para o ${rede} está configurado corretamente.\n\nEsta é uma simulação de redirecionamento da AW Technology.`);
};

// --- 2. INICIALIZAÇÃO DO SISTEMA ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Referências de UI
    const productGrid = document.getElementById('product-grid');
    const paginationContainer = document.getElementById('pagination-container');
    const menuOverlay = document.getElementById('menu-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    
    // Configurações
    let cart = JSON.parse(localStorage.getItem('aw_cart')) || [];
    let currentPage = 1;
    const productsPerPage = 9;

    // --- 3. BANCO DE DADOS (18 ITENS) ---
    const products = [
        { id: 101, name: "HD WD Purple Surveillance 6TB", price: 1229, image: "https://m.media-amazon.com/images/I/81S2Wb17P4L._AC_SL1500_.jpg", description: "Engenharia de elite para sistemas de segurança." },
        { id: 102, name: "Placa de Vídeo Inno3d RTX 5070", price: 6300, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400", description: "Desempenho de próxima geração." },
        { id: 103, name: "Kit Upgrade i9-14900K + B760M", price: 5200, image: "https://images.unsplash.com/photo-1591405351990-4726e33df58d?w=400", description: "O coração do seu setup de alta performance." },
        { id: 104, name: "HD Externo Expansion Seagate 4TB", price: 1300, image: "https://m.media-amazon.com/images/I/81tjLksKixL._AC_SL1500_.jpg", description: "Espaço de sobra para seus projetos." },
        { id: 105, name: "ASUS ROG Strix RTX 4090", price: 13350, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400", description: "A rainha das GPUs." },
        { id: 106, name: "MSI Gaming Slim RTX 4070 Ti Super", price: 8200, image: "https://m.media-amazon.com/images/I/71R2oIsc9HL._AC_SL1500_.jpg", description: "Potência em formato slim." },
        { id: 107, name: "AMD Ryzen 7 7800X3D", price: 2250, image: "https://m.media-amazon.com/images/I/51fS8rT9uWL._AC_SL1000_.jpg", description: "A melhor CPU para jogos do mundo." },
        { id: 108, name: "Intel Core i7-14700K", price: 2800, image: "https://m.media-amazon.com/images/I/61Sno74HAnL._AC_SL1200_.jpg", description: "Equilíbrio perfeito entre trabalho e play." },
        { id: 109, name: "Corsair Dominator Titanium DDR5", price: 2220, image: "https://m.media-amazon.com/images/I/71+v8O6NgeL._AC_SL1500_.jpg", description: "Memória de elite com estética premium." },
        { id: 110, name: "SSD Samsung 990 Pro 2TB", price: 3300, image: "https://m.media-amazon.com/images/I/61p-K8u+e9L._AC_SL1500_.jpg", description: "Velocidade de leitura absurda." },
        { id: 111, name: "Water Cooler Kraken Elite 360", price: 2250, image: "https://m.media-amazon.com/images/I/71XG83O50KL._AC_SL1500_.jpg", description: "Refrigeração com tela LCD customizável." },
        { id: 112, name: "Lian Li Uni Fan SL-LCD 120", price: 352, image: "https://m.media-amazon.com/images/I/61Uv5vVq14L._AC_SL1500_.jpg", description: "Fans com telas LCD integradas." },
        { id: 113, name: "Gabinete Hyte Y70 Touch Infinite", price: 3920, image: "https://m.media-amazon.com/images/I/71Zp+T+f2vL._AC_SL1500_.jpg", description: "Gabinete panorâmico com tela touch 4K." },
        { id: 114, name: "Lian Li O11 Vision Compact", price: 1280, image: "https://m.media-amazon.com/images/I/61R-8C9F-5L._AC_SL1500_.jpg", description: "Design visionário com três vidros." },
        { id: 115, name: "Water Cooler MSI MAG Coreliquid", price: 920, image: "https://m.media-amazon.com/images/I/61qYF8Y0f2L._AC_SL1500_.jpg", description: "Estética clean em branco." },
        { id: 116, name: "Gabinete Lian Li PC-O11 Dynamic XL", price: 1800, image: "https://m.media-amazon.com/images/I/71Zp+T+f2vL._AC_SL1500_.jpg", description: "O clássico dos entusiastas." },
        { id: 117, name: "Fonte Corsair RM1000x Shift", price: 1450, image: "https://m.media-amazon.com/images/I/718V3S-K0AL._AC_SL1500_.jpg", description: "Energia estável com cabos laterais." },
        { id: 118, name: "Teclado Custom Mecânico Elite", price: 1200, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400", description: "Experiência de digitação única." }
    ];

    // --- 4. FUNÇÕES DE RENDERIZAÇÃO ---
    window.renderProducts = () => {
        if (!productGrid) return;
        
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const currentItems = products.slice(start, end);

        productGrid.innerHTML = currentItems.map(p => {
            // Proxy Weserv para garantir HTTPS e evitar bloqueio da Amazon
            const imgUrl = `https://images.weserv.nl/?url=${encodeURIComponent(p.image)}&w=400&fit=contain`;

            return `
            <div class="card-premium bg-gray-800 p-4 rounded-2xl border border-gray-700 flex flex-col h-full shadow-lg group transition-all duration-300">
                <div class="bg-white rounded-xl mb-4 h-48 flex items-center justify-center overflow-hidden">
                    <img src="${imgUrl}" class="max-h-full p-2 group-hover:scale-110 transition-transform duration-500" onerror="this.src='https://placehold.co/400?text=Hardware'">
                </div>
                <h4 class="text-white font-bold mb-1 line-clamp-2">${p.name}</h4>
                <p class="text-gray-400 text-xs mb-4 line-clamp-2 flex-grow">${p.description}</p>
                <div class="mt-auto pt-4 border-t border-gray-700/50">
                    <span class="text-blue-400 text-xl font-black block mb-3">R$ ${p.price.toLocaleString('pt-br', {minimumFractionDigits: 2})}</span>
                    <button onclick="addToCart(${p.id})" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/20">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>`;
        }).join('');

        renderPaginationControls();
    };

    const renderPaginationControls = () => {
        if (!paginationContainer) return;
        const totalPages = Math.ceil(products.length / productsPerPage);
        
        paginationContainer.innerHTML = Array.from({ length: totalPages }, (_, i) => `
            <button onclick="changePage(${i + 1})" class="w-10 h-10 rounded-lg font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500 hover:bg-gray-700'}">
                ${i + 1}
            </button>
        `).join('');
    };

    window.changePage = (page) => {
        currentPage = page;
        window.renderProducts();
        document.getElementById('product-grid-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    // --- 5. LÓGICA DO CARRINHO (GLOBAL) ---
    window.addToCart = (id) => {
        const product = products.find(p => p.id == id);
        if (product) {
            cart.push(product);
            localStorage.setItem('aw_cart', JSON.stringify(cart));
            updateCartUI();
            
            // Abrir sidebar automaticamente
            cartSidebar?.classList.remove('translate-x-full');
            menuOverlay?.classList.remove('hidden');
            document.body.classList.add('no-scroll');
        }
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        localStorage.setItem('aw_cart', JSON.stringify(cart));
        updateCartUI();
    };

    function updateCartUI() {
        const counts = document.querySelectorAll('#cart-count, #cart-count-mobile');
        counts.forEach(c => { if(c) c.innerText = cart.length; });
        
        const cartContainer = document.getElementById('cart-items');
        const totalElement = document.getElementById('cart-total');
        
        if (cartContainer) {
            if (cart.length === 0) {
                cartContainer.innerHTML = '<p class="text-gray-500 text-center py-10">Carrinho vazio.</p>';
            } else {
                cartContainer.innerHTML = cart.map((item, i) => `
                    <div class="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700">
                        <img src="${item.image}" class="w-12 h-12 object-contain bg-white rounded-lg">
                        <div class="flex-1 min-w-0">
                            <p class="text-xs font-bold text-white truncate">${item.name}</p>
                            <p class="text-blue-400 text-sm font-bold">R$ ${item.price.toLocaleString('pt-br')}</p>
                        </div>
                        <button onclick="removeFromCart(${i})" class="text-gray-500 hover:text-red-500 p-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </button>
                    </div>
                `).join('');
            }
        }

        if (totalElement) {
            const total = cart.reduce((acc, item) => acc + item.price, 0);
            totalElement.innerText = `R$ ${total.toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
        }
    }

    // --- 6. EVENTOS DE UI (ABRIR/FECHAR) ---
    const toggleCart = () => {
        cartSidebar?.classList.toggle('translate-x-full');
        menuOverlay?.classList.toggle('hidden');
        document.body.classList.toggle('no-scroll');
    };

    document.getElementById('cart-btn')?.addEventListener('click', toggleCart);
    document.getElementById('cart-btn-mobile-trigger')?.addEventListener('click', toggleCart);
    document.getElementById('close-cart')?.addEventListener('click', toggleCart);
    
    document.getElementById('menu-btn')?.addEventListener('click', () => {
        document.getElementById('mobile-menu')?.classList.remove('translate-x-full');
        menuOverlay?.classList.remove('hidden');
        document.body.classList.add('no-scroll');
    });

    const closeAll = () => {
        document.getElementById('mobile-menu')?.classList.add('translate-x-full');
        cartSidebar?.classList.add('translate-x-full');
        menuOverlay?.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    };

    document.getElementById('close-btn')?.addEventListener('click', closeAll);
    menuOverlay?.addEventListener('click', closeAll);

    // Checkout WhatsApp
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        if (cart.length === 0) return alert("Adicione itens ao carrinho!");
        const total = cart.reduce((acc, item) => acc + item.price, 0);
        let msg = "🚀 *NOVO PEDIDO - AW TECHNOLOGY*\n\n";
        cart.forEach(i => msg += `• ${i.name}\n`);
        msg += `\n💰 *TOTAL: R$ ${total.toLocaleString('pt-br')}*`;
        window.open(`https://wa.me/5511985878638?text=${encodeURIComponent(msg)}`, '_blank');
    });

    // Início
    window.renderProducts();
    updateCartUI();
});
