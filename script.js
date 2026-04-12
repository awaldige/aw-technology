document.addEventListener('DOMContentLoaded', () => {

    // ========================
    // ELEMENTOS
    // ========================
    const productGrid = document.getElementById('product-grid');
    const cartCount = document.getElementById('cart-count');

    let cart = JSON.parse(localStorage.getItem('aw_cart')) || [];

    // ========================
    // PRODUTOS
    // ========================
    const products = [
        {
            id: 1,
            name: "RTX 4090",
            price: 13000,
            image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 2,
            name: "Ryzen 7 7800X3D",
            price: 2500,
            image: "https://m.media-amazon.com/images/I/51fS8rT9uWL._AC_SL1000_.jpg"
        },
        {
            id: 3,
            name: "SSD 990 Pro",
            price: 1500,
            image: "https://m.media-amazon.com/images/I/61p-K8u+e9L._AC_SL1500_.jpg"
        }
    ];

    // ========================
    // RENDER PRODUTOS
    // ========================
    function renderProducts() {
        productGrid.innerHTML = products.map(p => `
            <div class="bg-gray-800 p-4 rounded-xl">
                <div class="product-img-container mb-4">
                    <img 
                        src="${p.image}" 
                        loading="lazy"
                        onerror="this.onerror=null;this.src='https://placehold.co/400x400';">
                </div>
                <h2 class="font-bold">${p.name}</h2>
                <p class="text-blue-400">R$ ${p.price}</p>
                <button onclick="addToCart(${p.id})" class="bg-blue-600 w-full mt-3 py-2 rounded">
                    Adicionar
                </button>
            </div>
        `).join('');
    }

    // ========================
    // CARRINHO
    // ========================
    window.addToCart = (id) => {
        const product = products.find(p => p.id === id);
        cart.push(product);

        localStorage.setItem('aw_cart', JSON.stringify(cart));
        updateCart();

        mostrarToast("🛒 Adicionado ao carrinho");
    };

    function updateCart() {
        cartCount.innerText = cart.length;
    }

    // ========================
    // SOCIAL LINKS
    // ========================
    document.addEventListener("click", function(e) {
        if (e.target.closest(".social-link")) {
            e.preventDefault();
            const rede = e.target.closest(".social-link").dataset.rede;
            mostrarToast(`🚧 ${rede} em desenvolvimento`);
        }
    });

    // ========================
    // TOAST
    // ========================
    function mostrarToast(msg) {
        const toast = document.createElement("div");
        toast.innerText = msg;

        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #111827;
            padding: 12px 20px;
            border-radius: 10px;
            z-index: 9999;
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    // INIT
    renderProducts();
    updateCart();
});
