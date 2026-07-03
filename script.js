/** * AW TECHNOLOGY - VERCEL STABLE v11.0
 * UPDATE: Supabase Sync + Post-Checkout Cart Clearance
 */

// 1. CONFIGURAÇÃO SUPABASE
const supabaseUrl = 'https://jlfjlzogrmsolgwisuvs.supabase.co'; 
const supabaseKey = 'sb_publishable_0J6zv-geHQnKUkL9AzCrNQ_BN7tCTTr';

// Usamos 'sb' para garantir que não haja conflito com a biblioteca global
const sb = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. ESTADO GLOBAL
let products = []; 
// Ajustado para 'aw_cart' conforme definido no início e no salvamento
let cart = JSON.parse(localStorage.getItem('aw_cart')) || [];
let currentPage = 1;
const productsPerPage = 9;

// 3. FUNÇÕES DE DADOS (SUPABASE)
async function loadProducts() {
    try {
        console.log("Sincronizando com Supabase...");
        const { data, error } = await sb
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        products = data || [];
        console.log("Produtos carregados:", products.length);
        window.renderProducts();
    } catch (err) {
        console.error("Erro ao carregar banco de dados:", err.message);
        const grid = document.getElementById('product-grid');
        if (grid) grid.innerHTML = `<p class="text-center text-red-400 col-span-full py-10">Erro de conexão com o banco de dados.</p>`;
    }
}

// 4. FUNÇÕES GLOBAIS DE UI
window.renderProducts = () => {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.style.minHeight = '500px';

    if (products.length === 0) {
        productGrid.innerHTML = '<p class="text-center text-gray-500 col-span-full py-20">Nenhum produto em estoque.</p>';
        return;
    }

    const start = (currentPage - 1) * productsPerPage;
    const items = products.slice(start, start + productsPerPage);

    const htmlContent = items.map(p => {
        const validImage = p.image && p.image.trim() !== '' ? p.image : 'https://placehold.co/400x400/1f2937/white?text=Hardware';
        
        return `
        <div class="card-premium bg-gray-800/40 p-5 rounded-2xl border border-gray-800 flex flex-col h-full group">
            <div class="product-img-container mb-5 flex items-center justify-center overflow-hidden rounded-xl bg-white/5 h-48">
                <img src="${validImage}" alt="${p.name}" 
                     class="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                     onerror="this.src='https://placehold.co/400x400/1f2937/white?text=Imagem+Indisponível'">
            </div>
            <h4 class="text-white font-bold mb-2 line-clamp-2">${p.name}</h4>
            <p class="text-gray-400 text-xs mb-5 line-clamp-2 leading-relaxed">${p.description || 'Sem descrição disponível.'}</p>
            <div class="mt-auto pt-5 border-t border-gray-700/50">
                <span class="text-blue-400 text-2xl font-black block mb-4 italic">R$ ${Number(p.price).toLocaleString('pt-br', {minimumFractionDigits: 2})}</span>
                <button onclick="addToCart(${p.id})" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.97]">
                    Adicionar
                </button>
            </div>
        </div>`;
    }).join('');

    productGrid.innerHTML = htmlContent;
    window.renderPagination();
};

window.renderPagination = () => {
    const container = document.getElementById('pagination-container');
    if (!container) return;
    const total = Math.ceil(products.length / productsPerPage);
    
    if (total <= 1) {
        container.innerHTML = '';
        return;
    }

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
    const total = cart.reduce((acc, i) => acc + (Number(i.price) || 0), 0);
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.innerText = `R$ ${total.toLocaleString('pt-br', {minimumFractionDigits: 2})}`;

    const container = document.getElementById('cart-items');
    if (container) {
        container.innerHTML = cart.length ? cart.map((item, i) => `
            <div class="flex items-center gap-4 bg-gray-900/80 p-3 rounded-xl border border-gray-800">
                <img src="${item.image}" class="w-12 h-12 object-contain bg-white/10 rounded-lg" onerror="this.src='https://placehold.co/100?text=IMG'">
                <div class="flex-1 min-w-0">
                    <p class="text-[11px] font-bold text-white truncate">${item.name}</p>
                    <p class="text-blue-400 text-xs font-bold">R$ ${Number(item.price).toLocaleString('pt-br', {minimumFractionDigits: 2})}</p>
                </div>
                <button onclick="removeFromCart(${i})" class="text-gray-500 hover:text-red-500 p-2 transition-colors">✕</button>
            </div>`).join('') : '<p class="text-center text-gray-600 py-10 uppercase text-xs tracking-widest">Carrinho Vazio</p>';
    }
};

// 5. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

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

    // BOTÃO FINALIZAR PEDIDO (CHECKOUT)
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        if (!cart.length) return alert("Carrinho vazio!");

        // 1. Prepara a Mensagem
        const total = cart.reduce((acc, i) => acc + (Number(i.price) || 0), 0);
        const msg = `Olá! Gostaria de encomendar:\n\n${cart.map(i => `• ${i.name}`).join('\n')}\n\n*Total: R$ ${total.toLocaleString('pt-br', {minimumFractionDigits: 2})}*`;
        
        // 2. Abre o WhatsApp
        window.open(`https://wa.me/5511985878638?text=${encodeURIComponent(msg)}`, '_blank');

        // 3. LIMPEZA DO CARRINHO (Após o pedido enviado)
        cart = []; // Esvazia o array local
        localStorage.removeItem('aw_cart'); // Remove do armazenamento permanente
        
        // 4. ATUALIZAÇÃO DA INTERFACE
        window.updateUI(); // Reseta contador e lista visual
        toggle(cartSidebar, false); // Fecha a barra lateral do carrinho
        
        console.log("Pedido processado: Carrinho limpo.");
    });

    window.updateUI();
});
