document.addEventListener('DOMContentLoaded', () => {
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

    // --- 0. Sistema de Proteção, Atalho ADM e Social Demo ---
    
    // Função para Mensagem de Redes Sociais (Modo Demo)
    window.socialDemo = (rede) => {
        alert(`🚀 MODO DEMONSTRAÇÃO: O link para o ${rede} está configurado corretamente no código, mas encontra-se temporariamente desativado nesta versão de testes da plataforma AW TECHNOLOGY.`);
    };

    const checkAdminVisibility = () => {
        const isAdmin = localStorage.getItem('aw_admin_auth') === 'true';
        const adminElements = document.querySelectorAll('.admin-only, a[href="admin.html"]');
        adminElements.forEach(el => {
            el.style.setProperty('display', isAdmin ? 'block' : 'none', 'important');
        });
    };

    let logoClicks = 0;
    const logo = document.querySelector('h1'); 
    logo?.addEventListener('click', () => {
        logoClicks++;
        if (logoClicks === 5) {
            window.location.href = 'login.html';
            logoClicks = 0;
        }
        setTimeout(() => { logoClicks = 0; }, 3000); 
    });

    // --- 1. Banco de Dados AW TECHNOLOGY ---
    const loadProducts = () => {
        const defaultProducts = [
            { id: 1, name: "GPU RTX Series Flow", price: 4599, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400", description: "" },
            { id: 2, name: "CPU Core Flow i9", price: 2899, image: "https://images.unsplash.com/photo-1591405351990-4726e33df58d?auto=format&fit=crop&q=80&w=400", description: "" }
        ];
        return JSON.parse(localStorage.getItem('aw_products')) || defaultProducts;
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
                    ${product.description && product.description.trim() !== "" 
                        ? product.description 
                        : "Hardware de elite selecionado pela AW TECHNOLOGY para máxima performance."}
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
        const section = document.getElementById('product-grid-section');
        if (section) {
            window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
        }
    };

    // --- 5. Checkout WhatsApp (AW TECHNOLOGY) ---
    checkoutBtn?.addEventListener('click', () => {
        if (cart.length === 0) return alert("Seu carrinho está vazio!");
        
        const numeroZap = "5511985878638";
        let mensagem = "🚀 *NOVO PEDIDO - AW TECHNOLOGY*\n\n";
        mensagem += "Olá! Selecionei estes itens de elite no catálogo:\n";
        mensagem += "------------------------------------------\n";
        
        let total = 0;
        cart.forEach(item => {
            const p = Number(item.price) || 0;
            mensagem += `📦 *${item.name}*\n   _R$ ${p.toLocaleString('pt-br', { minimumFractionDigits: 2 })}_\n\n`;
            total += p;
        });
        
        mensagem += "------------------------------------------\n";
        mensagem += `💰 *TOTAL: R$ ${total.toLocaleString('pt-br', { minimumFractionDigits: 2 })}*\n\n`;
        mensagem += "📱 _Pedido gerado pela plataforma AW Technology_";

        window.open(`https://wa.me/${numeroZap}?text=${encodeURIComponent(mensagem)}`, '_blank');
        
        cart = [];
        updateCartUI();
        if (!cartSidebar.classList.contains('translate-x-full')) toggleCart();
        
        setTimeout(() => {
            alert("Pedido enviado com sucesso para nossa consultoria!");
        }, 800);
    });

    // --- 6. Event Listeners UI ---
    cartBtn?.addEventListener('click', toggleCart);
    cartBtnMobile?.addEventListener('click', toggleCart);
    closeCart?.addEventListener('click', toggleCart);
    document.getElementById('menu-overlay')?.addEventListener('click', toggleCart);

    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    const toggleMobileMenu = () => {
        mobileMenu?.classList.toggle('translate-x-full');
        document.getElementById('menu-overlay')?.classList.toggle('hidden');
    };

    menuBtn?.addEventListener('click', toggleMobileMenu);
    closeBtn?.addEventListener('click', toggleMobileMenu);

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