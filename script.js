document.addEventListener('DOMContentLoaded', () => {
    // --- Referências de UI ---
    const productGrid = document.getElementById('product-grid');
    const cartCountElements = [document.getElementById('cart-count'), document.getElementById('cart-count-mobile')];
    
    // --- Variáveis de Paginação ---
    let currentPage = 1;
    const productsPerPage = 9;

    // Elementos do Carrinho
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartBtn = document.getElementById('cart-btn');
    const cartBtnMobile = document.getElementById('cart-btn-mobile');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // --- 0. Sistema de Proteção e Atalho ADM ---
    
    window.socialDemo = (rede) => {
        alert(`🚀 MODO DEMONSTRAÇÃO: O link para o ${rede} está configurado corretamente no código, mas encontra-se temporariamente desativado nesta versão de testes.`);
    };

    const checkAdminVisibility = () => {
        const isAdmin = localStorage.getItem('aw_admin_auth') === 'true';
        const adminElements = document.querySelectorAll('.admin-only, a[href="admin.html"]');
        adminElements.forEach(el => {
            el.style.setProperty('display', isAdmin ? 'block' : 'none', 'important');
        });
    };

    // Lógica dos 5 cliques na Logo
    let logoClicks = 0;
    const logo = document.querySelector('h1'); 
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            logoClicks++;
            if (logoClicks === 5) {
                window.location.href = 'login.html';
                logoClicks = 0;
            }
            setTimeout(() => { logoClicks = 0; }, 3000); 
        });
    }

    // --- 1. Banco de Dados AW TECHNOLOGY (Versão Final Fundida) ---
    const loadProducts = () => {
        const defaultProducts = [
            { id: 101, name: "Intel Core i7-14700K", price: 2800, image: "https://m.media-amazon.com/images/I/61Sno74HAnL._AC_SL1200_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 102, name: "Corsair Dominator Titanium DDR5 (32GB)", price: 2220, image: "https://m.media-amazon.com/images/I/71+v8O6NgeL._AC_SL1500_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 103, name: "SSD Samsung 990 Pro 2TB (NVMe Gen4)", price: 3300, image: "https://m.media-amazon.com/images/I/61p-K8u+e9L._AC_SL1500_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 104, name: "Water Cooler NZXT Kraken Elite 360 RGB Preto com Tela 2.72”", price: 2250, image: "https://m.media-amazon.com/images/I/71XG83O50KL._AC_SL1500_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 105, name: "Lian Li Uni Fan Sl - Lcd Wireless 120", price: 352, image: "https://m.media-amazon.com/images/I/61Uv5vVq14L._AC_SL1500_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 106, name: "Hyte Y70 Touch Infinite Pitch Gabinete Gamer Mid Tower 4K", price: 3920, image: "https://m.media-amazon.com/images/I/71Zp+T+f2vL._AC_SL1500_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 107, name: "Gabinete Gamer Lian Li O11 Vision Compact Branco", price: 1280, image: "https://m.media-amazon.com/images/I/61R-8C9F-5L._AC_SL1500_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 108, name: "Water Cooler MSI MAG Coreliquid A13, ARGB, 360mm, Branco", price: 920, image: "https://m.media-amazon.com/images/I/61qYF8Y0f2L._AC_SL1500_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 109, name: "Gabinete PC-O11 Dynamic XL ROG Certified Branco Full Tower", price: 1430, image: "https://m.media-amazon.com/images/I/71Zp+T+f2vL._AC_SL1500_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 110, name: "GPU RTX Series Flow", price: 4598, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 111, name: "CPU Core Flow i9", price: 2899, image: "https://images.unsplash.com/photo-1591405351990-4726e33df58d?auto=format&fit=crop&q=80&w=400", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 112, name: "HD WD Purple Surveillance 6TB 3.5\" - WD64PURZ", price: 1229, image: "https://m.media-amazon.com/images/I/81S2Wb17P4L._AC_SL1500_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 113, name: "Placa de Vídeo Inno3d RTX 5070", price: 6300, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400", description: "Hardware de elite selecionado pela AW TECHNOLOGY." },
            { id: 114, name: "Kit Upgrade, Intel i9-14900K, B760M DDR5, 16GB", price: 5200, image: "https://images.unsplash.com/photo-1591405351990-4726e33df58d?auto=format&fit=crop&q=80&w=400", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 115, name: "HD Externo Expansion Portátil, 4TB, USB 3.0, Seagate", price: 1300, image: "https://m.media-amazon.com/images/I/81tjLksKixL._AC_SL1500_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 116, name: "ASUS ROG Strix GeForce RTX 4090", price: 13350, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 117, name: "MSI Gaming Slim RTX 4070 Ti Super", price: 8200, image: "https://m.media-amazon.com/images/I/71R2oIsc9HL._AC_SL1500_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo" },
            { id: 118, name: "AMD Ryzen 7 7800X3D", price: 2250, image: "https://m.media-amazon.com/images/I/51fS8rT9uWL._AC_SL1000_.jpg", description: "Hardware de elite selecionado pela AW TECHNOLOGY." }
        ];

        const savedProducts = JSON.parse(localStorage.getItem('aw_products'));
        // Força a atualização se a lista estiver desatualizada ou vazia
        if (!savedProducts || savedProducts.length !== defaultProducts.length) {
            localStorage.setItem('aw_products', JSON.stringify(defaultProducts));
            return defaultProducts;
        }
        return savedProducts;
    };

    let cart = JSON.parse(localStorage.getItem('aw_cart')) || [];

    // --- 2. Interface do Carrinho ---
    const toggleCart = () => {
        if (!cartSidebar) return;
        cartSidebar.classList.toggle('translate-x-full');
        document.getElementById('menu-overlay')?.classList.toggle('hidden');
    };

    const renderCartItems = () => {
        if (!cartItemsContainer) return;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center mt-10">Seu carrinho está vazio.</p>';
            cartTotalElement.innerText = 'R$ 0,00';
            return;
        }
        let total = 0;
        cartItemsContainer.innerHTML = cart.map((item, index) => {
            const price = Number(item.price) || 0;
            total += price;
            return `
                <div class="flex items-center gap-4 bg-gray-800 p-3 rounded-xl border border-gray-700">
                    <img src="${item.image}" class="w-16 h-16 rounded-lg object-cover border border-gray-600">
                    <div class="flex-1">
                        <h4 class="text-sm font-bold truncate w-32">${item.name}</h4>
                        <p class="text-blue-400 font-bold text-sm">R$ ${price.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <button onclick="removeFromCart(${index})" class="text-gray-500 hover:text-red-500 transition-colors p-1">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                </div>
            `;
        }).join('');
        cartTotalElement.innerText = `R$ ${total.toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
    };

    const updateCartUI = () => {
        cartCountElements.forEach(el => { if (el) el.innerText = cart.length; });
        localStorage.setItem('aw_cart', JSON.stringify(cart));
        renderCartItems();
    };

    // --- 3. Ações Globais ---
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

    // --- 4. Renderização com Paginação ---
    const renderProducts = () => {
        if (!productGrid) return;
        const products = loadProducts();
        
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

        productGrid.innerHTML = currentProducts.map(product => `
            <div class="card-premium bg-gray-800 p-5 rounded-2xl border border-gray-700 transition-all duration-300 hover:border-blue-500 group flex flex-col">
                <div class="overflow-hidden rounded-xl mb-4 h-48">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                </div>
                <h4 class="text-xl font-bold mb-2">${product.name}</h4>
                <p class="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
                    ${product.description && product.description.trim() !== "" ? product.description : "Hardware de elite selecionado pela AW TECHNOLOGY."}
                </p>
                <div class="flex items-center justify-between mt-auto">
                    <span class="text-xl font-bold text-blue-400">R$ ${Number(product.price).toLocaleString('pt-br', { minimumFractionDigits: 2 })}</span>
                    <button onclick="addToCart(${product.id})" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-all active:scale-95">
                        Comprar
                    </button>
                </div>
            </div>
        `).join('');

        renderPaginationControls(products.length);
        initScrollReveal();
    };

    const renderPaginationControls = (totalProducts) => {
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        let paginationContainer = document.getElementById('pagination-container');

        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'pagination-container';
            paginationContainer.className = 'flex justify-center gap-4 mt-12';
            productGrid.after(paginationContainer);
        }

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let buttonsHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            buttonsHTML += `
                <button onclick="changePage(${i})" class="px-4 py-2 rounded-lg font-bold transition-all ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}">
                    ${i}
                </button>
            `;
        }
        paginationContainer.innerHTML = buttonsHTML;
    };

    window.changePage = (page) => {
        currentPage = page;
        renderProducts();
        window.scrollTo({ top: document.getElementById('product-grid').offsetTop - 100, behavior: 'smooth' });
    };

    // --- 5. Checkout WhatsApp ---
    checkoutBtn?.addEventListener('click', () => {
        if (cart.length === 0) return alert("Seu carrinho está vazio!");
        const numeroZap = "5511985878638";
        let mensagem = "🚀 *NOVO PEDIDO - AW TECHNOLOGY*\n\n";
        let total = 0;
        cart.forEach(item => {
            const p = Number(item.price) || 0;
            mensagem += `📦 *${item.name}* - R$ ${p.toLocaleString('pt-br', { minimumFractionDigits: 2 })}\n`;
            total += p;
        });
        mensagem += `\n💰 *TOTAL: R$ ${total.toLocaleString('pt-br', { minimumFractionDigits: 2 })}*`;
        window.open(`https://wa.me/${numeroZap}?text=${encodeURIComponent(mensagem)}`, '_blank');
        cart = [];
        updateCartUI();
        toggleCart();
    });

    // --- 6. Event Listeners UI ---
    cartBtn?.addEventListener('click', toggleCart);
    cartBtnMobile?.addEventListener('click', toggleCart);
    closeCart?.addEventListener('click', toggleCart);
    document.getElementById('menu-overlay')?.addEventListener('click', toggleCart);

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    menuBtn?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('translate-x-full');
        document.getElementById('menu-overlay')?.classList.toggle('hidden');
    });

    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.card-premium').forEach(card => {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            card.style.transition = "all 0.6s ease-out";
            observer.observe(card);
        });
    }

    checkAdminVisibility();
    renderProducts();
    updateCartUI();
});
