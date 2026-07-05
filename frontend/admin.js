/** * AW TECHNOLOGY - ADMIN PANEL v11.0
 * STATUS: Migrado para Neon via Vercel Serverless (FUNCIONANDO)
 */

// 1. CONFIGURAÇÃO NEON (Apontando para a sua API Route na Vercel)
const API_URL = '/api/products';

let products = [];

// 2. CARREGAR PRODUTOS DO BANCO (GET)
async function loadAdminProducts() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        products = data || [];
        
        renderAdminTable();
        updateStats();
    } catch (err) {
        console.error("Erro ao carregar banco (Neon):", err.message);
    }
}

// 3. RENDERIZAR TABELA
 Gentileza notar que mantivemos suas classes utilitárias idênticas
function renderAdminTable() {
    const list = document.getElementById('product-list');
    if (!list) return;

    if (products.length === 0) {
        list.innerHTML = `
            <tr>
                <td colspan="3" class="p-12 text-center text-gray-500 font-medium italic">
                    Nenhum hardware cadastrado no banco de dados.
                </td>
            </tr>`;
        return;
    }

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

// 5. SALVAR / EDITAR (POST / PUT)
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
        let response;

        if (id) {
            // EDITAR (PUT) -> Passamos o ID como parâmetro na URL (?id=...)
            response = await fetch(`${API_URL}?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            // CRIAR NOVO (POST)
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }

        if (!response.ok) {
            throw new Error("Falha ao salvar dados na API.");
        }

        closeModal();
        loadAdminProducts();
    } catch (err) {
        alert("Erro ao salvar: " + err.message);
    }
});

// 6. EXCLUIR PRODUTO (DELETE)
window.deleteProduct = async (id) => {
    if (!confirm("Deseja realmente excluir este hardware?")) return;

    try {
        // Passamos o ID a ser removido como parâmetro na URL (?id=...)
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error("Não foi possível excluir o produto.");
        }

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
    localStorage.removeItem('aw_guest_demo'); // Limpa também o estado demo se aplicável
    window.location.href = 'index.html';
};

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('aw_admin_auth') === 'true';
    const isGuest = localStorage.getItem('aw_guest_demo') === 'true';

    // Se não for admin logado nem visitante em modo de demonstração, barra o acesso
    if (!isAdmin && !isGuest) {
        window.location.href = 'index.html';
        return;
    }
    loadAdminProducts();
});