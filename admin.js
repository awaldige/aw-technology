// --- PROTEÇÃO ---
const authRole = localStorage.getItem('aw_auth_role');

(function verifyAuth() {
    if (localStorage.getItem('aw_admin_auth') !== 'true') {
        window.location.href = 'index.html'; // Redireciona para home se não logado
    }
})();

// --- PRODUTOS ---
// Tenta ler do localStorage; se estiver vazio, começa com array vazio
let products = JSON.parse(localStorage.getItem('aw_products')) || [];

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const modal = document.getElementById('modal');

// --- RENDER & STATS ---
function renderProducts() {
    if (!productList) return;

    // Atualiza a tabela
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
    `).join('') || '<tr><td colspan="3" class="p-10 text-center text-gray-600">Nenhum produto cadastrado.</td></tr>';

    // Salva no LocalStorage para o Site consumir
    localStorage.setItem('aw_products', JSON.stringify(products));
    
    // Atualiza os cards de estatísticas (Dashboard)
    updateStats();
}

function updateStats() {
    const totalItems = products.length;
    const totalValue = products.reduce((acc, p) => acc + Number(p.price), 0);
    const avgPrice = totalItems > 0 ? totalValue / totalItems : 0;

    if (document.getElementById('stat-total-items')) 
        document.getElementById('stat-total-items').innerText = totalItems;
    
    if (document.getElementById('stat-total-value')) 
        document.getElementById('stat-total-value').innerText = `R$ ${totalValue.toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
    
    if (document.getElementById('stat-avg-price')) 
        document.getElementById('stat-avg-price').innerText = `R$ ${avgPrice.toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
}

// --- MODAL ---
window.openModal = () => {
    modal.classList.replace('hidden', 'flex');
    productForm.reset();
    document.getElementById('product-id').value = ''; // Limpa o ID oculto
    document.getElementById('modal-title').innerText = "Cadastrar Produto";
};

window.closeModal = () => {
    modal.classList.replace('flex', 'hidden');
};

// --- SALVAR ---
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('product-id').value;
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    let image = document.getElementById('image').value.trim();
    const description = document.getElementById('description').value;

    // Correção de Imagem
    if (!image || !image.startsWith('http')) {
        image = "https://placehold.co/400x400/1f2937/white?text=AW+TECH";
    }

    if (id) {
        // Modo Edição
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = { id: Number(id), name, price, image, description };
        }
    } else {
        // Modo Novo Produto
        products.push({
            id: Date.now(),
            name,
            price,
            image,
            description
        });
    }

    closeModal();
    renderProducts();
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
window.deleteProduct = (id) => {
    if (confirm('Deseja remover este produto permanentemente do inventário?')) {
        products = products.filter(p => p.id !== id);
        renderProducts();
    }
};

// --- LOGOUT ---
window.logoutAdmin = () => {
    localStorage.removeItem('aw_admin_auth');
    window.location.href = 'index.html';
};

// --- INIT ---
renderProducts();
