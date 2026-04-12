// --- PROTEÇÃO ---
const authRole = localStorage.getItem('aw_auth_role');

(function verifyAuth() {
    if (localStorage.getItem('aw_admin_auth') !== 'true') {
        window.location.href = 'login.html';
    }
})();

// --- PRODUTOS ---
let products = JSON.parse(localStorage.getItem('aw_products')) || [];

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const modal = document.getElementById('modal');

// --- RENDER ---
function renderProducts() {
    if (!productList) return;

    if (products.length === 0) {
        productList.innerHTML = `
            <tr>
                <td colspan="3" class="text-center p-4 text-gray-500">
                    Nenhum produto cadastrado
                </td>
            </tr>
        `;
        return;
    }

    productList.innerHTML = products.map(p => `
        <tr class="border-b border-gray-700">
            <td class="p-4 flex items-center gap-3">
                <img src="${p.image}" class="w-12 h-12 rounded object-cover"
                     onerror="this.src='https://placehold.co/100x100?text=Erro'">
                <div>
                    <b>${p.name}</b><br>
                    <small>${p.description || ''}</small>
                </div>
            </td>

            <td class="text-center text-blue-400">
                R$ ${Number(p.price || 0).toLocaleString('pt-br', { minimumFractionDigits: 2 })}
            </td>

            <td class="text-center space-x-2">
                <button onclick="editProduct(${p.id})">✏️</button>
                <button onclick="deleteProduct(${p.id})">❌</button>
            </td>
        </tr>
    `).join('');

    localStorage.setItem('aw_products', JSON.stringify(products));
}

// --- MODAL ---
window.openModal = () => {
    if (!modal || !productForm) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    productForm.reset();
    document.getElementById('product-id').value = '';
};

window.closeModal = () => {
    if (!modal) return;

    modal.classList.remove('flex');
    modal.classList.add('hidden');
};

// --- SALVAR ---
if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('product-id').value;
        const name = document.getElementById('name').value;
        const price = parseFloat(document.getElementById('price').value);
        let image = document.getElementById('image').value.trim();
        const description = document.getElementById('description').value;

        // 🔥 CORREÇÃO MOBILE
        if (!image || !image.startsWith('http')) {
            image = "https://placehold.co/400x400/1f2937/white?text=AW+TECH";
        }

        if (id) {
            const index = products.findIndex(p => p.id == id);
            if (index !== -1) {
                products[index] = { ...products[index], name, price, image, description };
            }
        } else {
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
}

// --- EDITAR ---
window.editProduct = (id) => {
    const p = products.find(p => p.id == id);
    if (!p) return;

    document.getElementById('product-id').value = p.id;
    document.getElementById('name').value = p.name;
    document.getElementById('price').value = p.price;
    document.getElementById('image').value = p.image;
    document.getElementById('description').value = p.description || '';

    openModal();
};

// --- DELETE ---
window.deleteProduct = (id) => {
    if (!confirm('Remover produto?')) return;

    products = products.filter(p => p.id !== id);
    renderProducts();
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});
