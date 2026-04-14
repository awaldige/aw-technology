/** * AW TECHNOLOGY - VERCEL STABLE v9.0
 * UPDATE: Integração com Supabase (Nuvem) + Sincronização Global Realtime
 */

// 1. CONFIGURAÇÃO SUPABASE
const supabaseUrl = 'aw-technology-db';
const supabaseKey = 'jlfjlzogrmsolgwisuvs';
const supabase = supabasejs.createClient(supabaseUrl, supabaseKey);

// 2. ESTADO GLOBAL
let products = []; // Agora alimentado pela nuvem
let cart = JSON.parse(localStorage.getItem('aw_cart')) || [];
let currentPage = 1;
const productsPerPage = 9;

// 3. FUNÇÕES DE DADOS (SUPABASE)
async function loadProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        products = data;
        window.renderProducts();
    } catch (err) {
        console.error("Erro ao carregar banco de dados:", err.message);
        // Fallback: se o banco falhar, você pode opcionalmente carregar uma lista local aqui
    }
}

// 4. FUNÇÕES GLOBAIS DE UI
window.renderProducts = () => {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    const start = (currentPage - 1) * productsPerPage;
    const items = products.slice(start, start + productsPerPage);

    productGrid.innerHTML = items.map(p => {
        // Removemos o proxy weserv para evitar conflitos com imagens protegidas (como as do ML)
        // e usamos carregamento nativo com fallback
        return `
        <div class="card-premium bg-gray-800/40 p-5 rounded-2xl border border-gray-800 flex flex-col h-full group">
            <div class="product-img-container mb-5 flex items-center justify-center overflow-hidden rounded-xl bg-white/5 h-48">
                <img src="${p.image}" alt="${p.name}" 
                     class="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                     onerror="this.src='https://placehold.co/400x400/1f2937/white?text=Hardware'">
            </div>
            <h4 class="text-white font-bold mb-2 line-clamp-2">${p.name}</h4>
            <p class="text-gray-400 text-xs mb-5 line-clamp-2 leading-relaxed">${p.description}</p>
            <div class="mt-auto pt-5 border-t border-gray-700/50">
                <span class="text-blue-400 text-2xl font-black block mb-4 italic">R$ ${Number(p.price).toLocaleString('pt-br', {minimumFractionDigits: 2})}</span>
                <button onclick="addToCart(${p.id})" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.97]">
                    Adicionar
                </button>
            </div>
        </div>`;
    }).join('');
    window.renderPagination();
};

window.renderPagination = () => {
    const container = document.getElementById('pagination-container');
    if (!container) return;
    const total = Math.ceil(products.length / productsPerPage);
    container.innerHTML = Array.from({ length: total }, (_, i) => `
        <button onclick="changePage(${i + 1})" class="w-11 h-11 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-800 text-gray-500 hover:bg-gray-700'}">
            ${i + 1}
        </button>`).join('');
};

window.changePage = (p) => {
    currentPage = p;
    window.renderProducts();
    const section = document.getElementById('product-grid-section') || document.getElementById('product-grid');
    if (section) window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
};

window.addToCart = (id) => {
    const item = products.find(p => p.id == id);
    if (item) {
        cart.push(item);
        localStorage.setItem('aw_cart', JSON.stringify(cart));
        window.updateUI();
        
        const cartSidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('menu-overlay');
        if (cartSidebar) cartSidebar.classList.remove('translate-x-full');
        if (overlay) {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
        }
    }
};

window.removeFromCart = (i) => {
    cart.splice(i, 1);
    localStorage.setItem('aw_cart', JSON.stringify(cart));
    window.updateUI();
};

window.updateUI = () => {
    document.querySelectorAll('#cart-count, #cart-count-mobile').forEach(c => c.innerText = cart.length);
    const total = cart.reduce((acc, i) => acc + i.price, 0);
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.innerText = `R$ ${total.toLocaleString('pt-br', {minimumFractionDigits: 2})}`;

    const container = document.getElementById('cart-items');
    if (container) {
        container.innerHTML = cart.length ? cart.map((item, i) => `
            <div class="flex items-center gap-4 bg-gray-900/80 p-3 rounded-xl border border-gray-800">
                <img src="${item.image}" class="w-12 h-12 object-contain bg-white/10 rounded-lg" onerror="this.src='https://placehold.co/100?text=IMG'">
                <div class="flex-1 min-w-0">
                    <p class="text-[11px] font-bold text-white truncate">${item.name}</p>
                    <p class="text-blue-400 text-xs font-bold">R$ ${item.price.toLocaleString('pt-br', {minimumFractionDigits: 2})}</p>
                </div>
                <button onclick="removeFromCart(${i})" class="text-gray-500 hover:text-red-500 p-2 transition-colors">✕</button>
            </div>`).join('') : '<p class="text-center text-gray-600 py-10 uppercase text-xs tracking-widest">Carrinho Vazio</p>';
    }
};

// 5. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    // Carrega dados da nuvem
    loadProducts();

    // UI Listeners
    if (localStorage.getItem('aw_admin_auth') === 'true') {
        document.body.classList.add('is-admin');
    }

    const overlay = document.getElementById('menu-overlay');
    const mobileMenu = document.getElementById('mobile-menu');
    const cartSidebar = document.getElementById('cart-sidebar');

    const toggle = (el, isOpen) => {
        if (!el || !overlay) return;
        el.classList.toggle('translate-x-full', !isOpen);
        overlay.style.opacity = isOpen ? '1' : '0';
        overlay.style.pointerEvents = isOpen ? 'auto' : 'none';
    };

    document.getElementById('menu-btn')?.addEventListener('click', () => toggle(mobileMenu, true));
    document.getElementById('close-btn')?.addEventListener('click', () => toggle(mobileMenu, false));
    document.getElementById('cart-btn')?.addEventListener('click', () => toggle(cartSidebar, true));
    document.getElementById('cart-btn-mobile-trigger')?.addEventListener('click', () => toggle(cartSidebar, true));
    document.getElementById('close-cart')?.addEventListener('click', () => toggle(cartSidebar, false));
    overlay?.addEventListener('click', () => { toggle(mobileMenu, false); toggle(cartSidebar, false); });

    // Admin Access
    let logoClicks = 0;
    document.getElementById('admin-logo')?.addEventListener('click', () => {
        logoClicks++;
        setTimeout(() => { logoClicks = 0; }, 3000);
        if (logoClicks >= 5) {
            logoClicks = 0;
            const pass = prompt("🔐 ADMIN ACCESS");
            if (pass === "awaldige785143") {
                localStorage.setItem('aw_admin_auth', 'true');
                window.location.href = "admin.html";
            }
        }
    });

    // Checkout WhatsApp
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        if (!cart.length) return alert("Carrinho vazio!");
        const total = cart.reduce((acc, i) => acc + i.price, 0);
        const msg = `Olá! Gostaria de encomendar:\n\n${cart.map(i => `• ${i.name}`).join('\n')}\n\n*Total: R$ ${total.toLocaleString('pt-br')}*`;
        window.open(`https://wa.me/5511985878638?text=${encodeURIComponent(msg)}`, '_blank');
    });

    window.updateUI();
});
