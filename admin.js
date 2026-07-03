/** * AW TECHNOLOGY - ADMIN PANEL v10.0
 * Integração Direta com Supabase
 */

// 1. CONFIGURAÇÃO SUPABASE
const supabaseUrl = 'https://jlfjlzogrmsolgwisuvs.supabase.co'; 
const supabaseKey = 'sb_publishable_0J6zv-geHQnKUkL9AzCrNQ_BN7tCTTr';
const sb = window.supabase.createClient(supabaseUrl, supabaseKey);

let products = [];

// 2. CARREGAR PRODUTOS DO BANCO
async function loadAdminProducts() {
    try {
        const { data, error } = await sb
            .from('products')
            .select('*')
            .order('id', { ascending: false }); // Novos primeiro

        if (error) throw error;

        products = data || [];
        renderAdminTable();
        updateStats();
    } catch (err) {
        console.error("Erro ao carregar banco:", err.message);
    }
}

// 3. RENDERIZAR TABELA
function renderAdminTable() {
    const list = document.getElementById('product-list');
    if (!list) return;

    list.innerHTML = products.map(p => `
        <tr class="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
            <td class="p-4 flex items-center gap-4">
                <img src="${p.image}" class="w-12 h-12 object-contain bg-white/5 rounded-lg border border-gray-700" onerror="this.src='https://placehold.co/100?text=IMG'">
                <div>
                    <p class="font-bold text-sm text-white">${p.name}</p>
                    <p class="text-[10px] text-gray-500 line-clamp-1 max-w-xs">${p.description || 'Sem descrição'}</p>
                </div>
            </td>
            <td class="p-4 text-center font-black text-blue-400">
                R$ ${Number(p.price).toLocaleString('pt-br', {minimumFractionDigits: 2})}
            </td>
            <td class="p-4">
                <div class="flex justify-center gap-2">
                    <button onclick="editProduct(${p.id})" class="p-2 text-gray-400 hover:text-white transition">✏️</button>
                    <button onclick="deleteProduct(${p.id})" class="p-2 text-gray-400 hover:text-red-500 transition">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 4. ATUALIZAR DASHBOARD
function updateStats() {
    const totalItems = products.length;
    const totalValue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
    const avgPrice = totalItems > 0 ? totalValue / totalItems : 0;

    document.getElementById('stat-total-items').innerText = totalItems;
    document.getElementById('stat-total-value').innerText = `R$ ${totalValue.toLocaleString('pt-br', {minimumFractionDigits: 2})}`;
    document.getElementById('stat-avg-price').innerText = `R$ ${avgPrice.toLocaleString('pt-br', {minimumFractionDigits: 2})}`;
}

// 5. SALVAR / EDITAR (SUPABASE)
document.getElementById('product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        image: document.getElementById('image').value,
        description: document.getElementById('description').value
    };

    try {
        if (id) {
            // EDITAR
            const { error } = await sb.from('products').update(productData).eq('id', id);
            if (error) throw error;
        } else {
            // CRIAR NOVO
            const { error } = await sb.from('products').insert([productData]);
            if (error) throw error;
        }

        closeModal();
        loadAdminProducts();
    } catch (err) {
        alert("Erro ao salvar: " + err.message);
    }
});

// 6. EXCLUIR PRODUTO
window.deleteProduct = async (id) => {
    if (!confirm("Deseja realmente excluir este hardware?")) return;

    try {
        const { error } = await sb.from('products').delete().eq('id', id);
        if (error) throw error;
        loadAdminProducts();
    } catch (err) {
        alert("Erro ao excluir: " + err.message);
    }
};

// 7. AUXILIARES DE MODAL
window.openModal = () => {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('modal-title').innerText = "Cadastrar Produto";
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal').classList.add('flex');
};

window.closeModal = () => {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('modal').classList.remove('flex');
};

window.editProduct = (id) => {
    const p = products.find(item => item.id == id);
    if (!p) return;

    document.getElementById('product-id').value = p.id;
    document.getElementById('name').value = p.name;
    document.getElementById('price').value = p.price;
    document.getElementById('image').value = p.image;
    document.getElementById('description').value = p.description;
    
    document.getElementById('modal-title').innerText = "Editar Produto";
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal').classList.add('flex');
};

window.logoutAdmin = () => {
    localStorage.removeItem('aw_admin_auth');
    window.location.href = 'index.html';
};

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se está logado
    if (localStorage.getItem('aw_admin_auth') !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    loadAdminProducts();
});
