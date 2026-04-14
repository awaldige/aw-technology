/** * AW TECHNOLOGY - ADMIN CLOUD v9.0
 * UPDATE: CRUD Completo via Supabase + Segurança de Role
 */

// --- CONFIGURAÇÃO SUPABASE ---
const supabaseUrl = 'SUA_URL_AQUI';
const supabaseKey = 'SUA_CHAVE_ANON_AQUI';
const supabase = supabasejs.createClient(supabaseUrl, supabaseKey);

// --- PROTEÇÃO ---
(function verifyAuth() {
    if (localStorage.getItem('aw_admin_auth') !== 'true') {
        window.location.href = 'index.html';
    }
})();

// --- ESTADO GLOBAL ---
let products = [];
const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const modal = document.getElementById('modal');

// --- BUSCA DINÂMICA (READ) ---
async function loadAdminProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Erro ao buscar produtos:', error);
        return;
    }

    products = data;
    renderProducts();
}

// --- RENDER & STATS ---
function renderProducts() {
    if (!productList) return;

    productList.innerHTML = products.map(p => `
        <tr class="border-b border-gray-700/50 hover:bg-gray-800/30 transition">
            <td class="p-4 flex items-center gap-3">
                <img src="${p.image}" class="w-12 h-12 object-contain bg-white/10 rounded"
                     onerror="this.src='https://placehold.co/100x100?text=Hardware'">
                <div>
                    <b class="text-white">${p.name}</b><br>
                    <small class="text-gray-500 line-clamp-1">${p.description}</small>
                </div>
            </td>
            <td class="text-center text-blue-400 font-bold">
                R$ ${Number(p.price).toLocaleString('pt-br', { minimumFractionDigits: 2 })}
            </td>
            <td class="text-center">
                <div class="flex justify-center gap-2">
                    <button onclick="editProduct(${p.id})" class="p-2 hover:bg-blue-500/20 rounded transition">✏️</button>
                    <button onclick="deleteProduct(${p.id})" class="p-2 hover:bg-red-500/20 rounded transition">❌</button>
                </div>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="3" class="p-10 text-center text-gray-600">Nenhum produto no banco de dados.</td></tr>';

    updateStats();
}

function updateStats() {
    const totalItems = products.length;
    const totalValue = products.reduce((acc, p) => acc + Number(p.price), 0);
    const avgPrice = totalItems > 0 ? totalValue / totalItems : 0;

    const ids = ['stat-total-items', 'stat-total-value', 'stat-avg-price'];
    const values = [totalItems, `R$ ${totalValue.toLocaleString('pt-br')}`, `R$ ${avgPrice.toLocaleString('pt-br')}`];
    
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.innerText = values[i];
    });
}

// --- MODAL ---
window.openModal = () => {
    modal.classList.replace('hidden', 'flex');
    productForm.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('modal-title').innerText = "Cadastrar Produto";
};

window.closeModal = () => {
    modal.classList.replace('flex', 'hidden');
};

// --- SALVAR (CREATE / UPDATE) ---
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // TRAVA PARA CONVIDADO (Mantida conforme solicitado)
    if (localStorage.getItem('aw_auth_role') === 'guest') {
        alert("Ação não permitida no Modo Demonstração.");
        closeModal();
        return;
    }

    const id = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        image: document.getElementById('image').value.trim() || "https://placehold.co/400?text=AW+TECH",
        description: document.getElementById('description').value
    };

    // UPSERT no Supabase: Se tiver ID atualiza, se não tiver cria.
    const { error } = await supabase
        .from('products')
        .upsert(id ? { id: Number(id), ...productData } : productData);

    if (error) {
        alert("Erro ao salvar no banco: " + error.message);
    } else {
        closeModal();
        loadAdminProducts(); // Recarrega do banco para garantir sincronia
    }
});

// --- EDITAR ---
window.editProduct = (id) => {
    const p = products.find(p => p.id == id);
    if (!p) return;

    document.getElementById('product-id').value = p.id;
    document.getElementById('name').value = p.name;
    document.getElementById('price').value = p.price;
    document.getElementById('image').value = p.image;
    document.getElementById('description').value = p.description;
    
    document.getElementById('modal-title').innerText = "Editar Produto";
    modal.classList.replace('hidden', 'flex');
};

// --- DELETE ---
window.deleteProduct = async (id) => {
    if (localStorage.getItem('aw_auth_role') === 'guest') {
        alert("Ação não permitida no Modo Demonstração.");
        return;
    }

    if (confirm('Deseja remover este produto permanentemente da nuvem?')) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            alert("Erro ao deletar: " + error.message);
        } else {
            loadAdminProducts();
        }
    }
};

// --- LOGOUT ---
window.logoutAdmin = () => {
    localStorage.removeItem('aw_admin_auth');
    localStorage.removeItem('aw_auth_role');
    window.location.href = 'index.html';
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('aw_auth_role');
    const demoBanner = document.getElementById('demo-banner');

    if (role === 'guest') {
        if (demoBanner) demoBanner.classList.remove('hidden');
        const btnNew = document.getElementById('btn-new-product');
        if (btnNew) btnNew.classList.add('opacity-50', 'cursor-not-allowed');
    }

    loadAdminProducts(); // Busca inicial no Supabase
});
