// --- 0. Proteção de Acesso e Níveis de Permissão ---
const authRole = localStorage.getItem('aw_auth_role'); // 'admin' ou 'guest'

(function verifyAuth() {
    if (localStorage.getItem('aw_admin_auth') !== 'true') {
        window.location.href = 'login.html'; 
    }

    // Lógica para Modo Demonstração (Colaborador/Guest)
    if (authRole === 'guest') {
        // Exibe o banner explicativo
        const banner = document.getElementById('demo-banner');
        if (banner) banner.classList.remove('hidden');

        // Estiliza o botão de "Novo Produto" para parecer desativado
        const newBtn = document.getElementById('btn-new-product');
        if (newBtn) {
            newBtn.classList.replace('bg-green-600', 'bg-gray-600');
            newBtn.classList.add('opacity-50', 'cursor-not-allowed');
            newBtn.innerHTML = '<span>🔒</span> Modo Visualização';
            newBtn.onclick = () => alert("Acesso Restrito: Como colaborador convidado, você não tem permissão para adicionar novos produtos.");
        }
    }
})();

// Carrega produtos da AW TECHNOLOGY
let products = JSON.parse(localStorage.getItem('aw_products')) || [
    { 
        id: 1, 
        name: "GPU RTX Series Flow", 
        price: 4599, 
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400", 
        description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo." 
    },
    { 
        id: 2, 
        name: "CPU Core Flow i9", 
        price: 2899, 
        image: "https://images.unsplash.com/photo-1591405351990-4726e33df58d?auto=format&fit=crop&q=80&w=400", 
        description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo." 
    }
];

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const modal = document.getElementById('modal');

// --- 1. Dashboard de Métricas ---
function updateDashboard() {
    const totalItems = products.length;
    const totalValue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
    const avgPrice = totalItems > 0 ? totalValue / totalItems : 0;

    const statItems = document.getElementById('stat-total-items');
    const statValue = document.getElementById('stat-total-value');
    const statAvg = document.getElementById('stat-avg-price');

    if (statItems) statItems.innerText = totalItems;
    if (statValue) statValue.innerText = totalValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    if (statAvg) statAvg.innerText = avgPrice.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

// --- 2. Renderização Otimizada ---
function renderProducts() {
    if (!productList) return;

    productList.innerHTML = products.map(p => `
        <tr class="border-b border-gray-700 hover:bg-gray-750/50 transition-all">
            <td class="p-4">
                <div class="flex items-center gap-3">
                    <img src="${p.image}" class="w-12 h-12 rounded-lg object-cover border border-gray-600 shadow-sm">
                    <div class="flex flex-col">
                        <span class="font-bold text-gray-100">${p.name}</span>
                        <span class="text-xs text-gray-500 truncate w-48 italic">
                            ${p.description}
                        </span>
                    </div>
                </div>
            </td>
            <td class="p-4 text-blue-400 font-bold text-center">
                R$ ${Number(p.price).toLocaleString('pt-br', { minimumFractionDigits: 2 })}
            </td>
            <td class="p-4">
                <div class="flex justify-center gap-3">
                    <button onclick="editProduct(${p.id})" class="text-yellow-500 hover:bg-yellow-500/10 px-3 py-1.5 border border-yellow-500/30 rounded-lg transition text-sm font-semibold">
                        ${authRole === 'guest' ? 'Ver' : 'Editar'}
                    </button>
                    <button onclick="deleteProduct(${p.id})" class="text-red-500 hover:bg-red-500/10 px-3 py-1.5 border border-red-500/30 rounded-lg transition text-sm font-semibold ${authRole === 'guest' ? 'opacity-30' : ''}">
                        Excluir
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    updateDashboard();
    localStorage.setItem('aw_products', JSON.stringify(products));
}

// --- 3. Funções do Modal ---
window.openModal = (editMode = false) => {
    // Se for guest e não for modo edição, bloqueia a abertura do modal de cadastro
    if (authRole === 'guest' && !editMode) return;

    modal.classList.replace('hidden', 'flex');
    if (!editMode) {
        productForm.reset();
        document.getElementById('product-id').value = '';
        document.getElementById('modal-title').innerText = 'Cadastrar Hardware AW';
    }
    
    // Esconde o botão de salvar se for guest tentando editar
    const saveBtn = document.getElementById('btn-save-product');
    if (saveBtn) {
        if (authRole === 'guest') {
            saveBtn.classList.add('hidden');
        } else {
            saveBtn.classList.remove('hidden');
        }
    }
}

window.closeModal = () => {
    modal.classList.replace('flex', 'hidden');
}

// --- 4. Ações de Produto (Create & Update) ---
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Trava de segurança para Guest
    if (authRole === 'guest') {
        alert("🔒 Ação não permitida: Acesso restrito apenas para visualização.");
        closeModal();
        return;
    }
    
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const image = document.getElementById('image').value || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400";
    const description = document.getElementById('description').value.trim();

    const defaultDesc = "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos e elevar seu setup ao padrão competitivo.";

    if (id) {
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = { 
                ...products[index], 
                name, 
                price, 
                image, 
                description: description || defaultDesc 
            };
        }
    } else {
        products.push({ 
            id: Date.now(), 
            name, 
            price, 
            image, 
            description: description || defaultDesc 
        });
    }

    closeModal();
    renderProducts();
});

// --- 5. Editar e Excluir ---
window.editProduct = (id) => {
    const product = products.find(p => p.id == id);
    if (product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('image').value = product.image;
        document.getElementById('description').value = product.description || '';
        document.getElementById('modal-title').innerText = authRole === 'guest' ? 'Detalhes do Hardware' : 'Ajustar Hardware de Elite';
        openModal(true);
    }
}

window.deleteProduct = (id) => {
    // Trava de segurança para Guest
    if (authRole === 'guest') {
        alert("🔒 Acesso Negado: Você não tem permissões administrativas para excluir itens do inventário.");
        return;
    }

    if (confirm('Deseja realmente remover este item do inventário AW TECHNOLOGY?')) {
        products = products.filter(p => p.id !== id);
        renderProducts();
    }
}

// --- 6. Logout ---
window.logoutAdmin = () => {
    localStorage.removeItem('aw_admin_auth');
    localStorage.removeItem('aw_auth_role');
    window.location.href = 'index.html';
}

// Inicialização
renderProducts();