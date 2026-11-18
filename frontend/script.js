
/* =====================================================
   AW TECHNOLOGY — FRONTEND STABLE v13.0
   API: Render + Neon
   Ambiente: Demonstrativo de portfólio
   ===================================================== */


/* =====================================================
   1. CONFIGURAÇÃO DA API
   ===================================================== */

const API_URL = "https://aw-technology.onrender.com/api/products";

const PLACEHOLDER_IMAGE =
    "https://placehold.co/400x400/1f2937/white?text=Hardware";

console.log("API configurada:", API_URL);


/* =====================================================
   2. ESTADO GLOBAL
   ===================================================== */

let products = [];

let cart = (() => {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem("aw_cart") || "[]"
        );

        return Array.isArray(savedCart) ? savedCart : [];

    } catch (error) {
        console.warn(
            "Carrinho salvo inválido. Iniciando vazio.",
            error
        );

        return [];
    }
})();

let currentPage = 1;

const productsPerPage = 9;


/* =====================================================
   3. FUNÇÕES AUXILIARES
   ===================================================== */

function formatPrice(value) {
    const price = Number(value);

    return (Number.isFinite(price) ? price : 0).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}

// Compatibilidade com chamadas anteriores.
function paddingPrice(value) {
    return formatPrice(value);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function getSafeImage(image) {
    if (typeof image !== "string" || !image.trim()) {
        return PLACEHOLDER_IMAGE;
    }

    try {
        const url = new URL(image, window.location.href);

        if (
            url.protocol === "https:" ||
            url.protocol === "http:"
        ) {
            return url.href;
        }

    } catch (error) {
        console.warn("Imagem inválida:", image);
    }

    return PLACEHOLDER_IMAGE;
}

function saveCart() {
    try {
        localStorage.setItem(
            "aw_cart",
            JSON.stringify(cart)
        );

    } catch (error) {
        console.error(
            "Não foi possível salvar o carrinho:",
            error
        );
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => {
        return total + (Number(item.price) || 0);
    }, 0);
}


/* =====================================================
   4. CARREGAMENTO DOS PRODUTOS
   ===================================================== */


async function loadProducts() {
    const productGrid = document.getElementById("product-grid");
    const CACHE_KEY = "aw_products_cache";

    // 1. Exibe imediatamente os produtos salvos anteriormente.
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);

        if (cachedData) {
            const cachedProducts = JSON.parse(cachedData);

            if (Array.isArray(cachedProducts)) {
                products = cachedProducts.filter(product => {
                    return (
                        product &&
                        product.id !== undefined &&
                        Number.isFinite(Number(product.id))
                    );
                });

                if (products.length > 0) {
                    console.log(
                        "Catálogo exibido pelo cache:",
                        products.length
                    );

                    currentPage = 1;
                    window.renderProducts();
                }
            }
        }
    } catch (error) {
        console.warn("Não foi possível utilizar o cache:", error);
    }

    // 2. Mostra carregamento somente quando não há produtos salvos.
    if (products.length === 0 && productGrid) {
        productGrid.innerHTML = `
            <p class="text-center text-gray-500 col-span-full py-20">
                Carregando catálogo...
            </p>
        `;
    }

    // 3. Busca os dados atualizados na API.
    try {
        console.log("Atualizando produtos pela API...");

        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `Erro HTTP ${response.status}: ${response.statusText}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(
                "A API retornou um formato de dados inválido."
            );
        }

        products = data.filter(product => {
            return (
                product &&
                product.id !== undefined &&
                Number.isFinite(Number(product.id))
            );
        });

        // 4. Atualiza o cache para a próxima visita.
        try {
            localStorage.setItem(
                CACHE_KEY,
                JSON.stringify(products)
            );
        } catch (error) {
            console.warn("Não foi possível atualizar o cache:", error);
        }

        console.log(
            "Produtos atualizados pela API:",
            products.length
        );

        currentPage = 1;
        window.renderProducts();

    } catch (error) {
        console.error("Erro ao atualizar produtos:", error);

        // Se já existem produtos em cache, mantém o catálogo visível.
        if (products.length > 0) {
            console.warn(
                "Mantendo catálogo salvo devido à falha na API."
            );
            return;
        }

        if (productGrid) {
            productGrid.innerHTML = `
                <div class="col-span-full text-center py-16">
                    <p class="text-red-400 font-semibold mb-3">
                        Não foi possível carregar os produtos.
                    </p>

                    <p class="text-gray-500 text-xs mb-5">
                        Verifique sua conexão e tente novamente.
                    </p>

                    <button
                        type="button"
                        onclick="loadProducts()"
                        class="primary-button px-6 py-3 rounded-xl text-white text-xs font-bold"
                    >
                        TENTAR NOVAMENTE
                    </button>
                </div>
            `;
        }
    }
}

window.loadProducts = loadProducts;


/* =====================================================
   5. RENDERIZAÇÃO DOS PRODUTOS
   ===================================================== */

window.renderProducts = function () {
    const productGrid = document.getElementById("product-grid");

    if (!productGrid) return;

    productGrid.style.minHeight = "300px";

    if (products.length === 0) {
        productGrid.innerHTML = `
            <p class="text-center text-gray-500 col-span-full py-20">
                Nenhum produto disponível no momento.
            </p>
        `;

        window.renderPagination();

        return;
    }

    const totalPages = Math.ceil(
        products.length / productsPerPage
    );

    currentPage = Math.min(
        Math.max(currentPage, 1),
        Math.max(totalPages, 1)
    );

    const start = (currentPage - 1) * productsPerPage;

    const items = products.slice(
        start,
        start + productsPerPage
    );

    productGrid.innerHTML = items.map(product => {
        const image = escapeHTML(
            getSafeImage(product.image)
        );

        const name = escapeHTML(
            product.name || "Produto"
        );

        const description = escapeHTML(
            product.description || "Sem descrição disponível."
        );

        const price = formatPrice(product.price);
        const id = Number(product.id);

        return `
            <article class="card-premium p-5 rounded-2xl flex flex-col h-full group">

                <div class="product-img-container mb-5">
                    <img
                        src="${image}"
                        alt="${name}"
                        loading="lazy"
                        decoding="async"
                        onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}'"
                    >
                </div>

                <h3 class="text-white font-bold mb-2 line-clamp-2">
                    ${name}
                </h3>

                <p class="text-gray-400 text-xs mb-5 line-clamp-2 leading-relaxed">
                    ${description}
                </p>

                <div class="mt-auto pt-5 border-t border-gray-700/50">

                    <span class="text-blue-400 text-2xl font-black block mb-4">
                        R$ ${price}
                    </span>

                    <button
                        type="button"
                        onclick="addToCart(${id})"
                        class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.97]"
                    >
                        Adicionar ao carrinho
                    </button>

                </div>

            </article>
        `;
    }).join("");

    window.renderPagination();
};


/* =====================================================
   6. PAGINAÇÃO
   ===================================================== */

window.renderPagination = function () {
    const container = document.getElementById(
        "pagination-container"
    );

    if (!container) return;

    const totalPages = Math.ceil(
        products.length / productsPerPage
    );

    if (totalPages <= 1) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = Array.from(
        { length: totalPages },
        (_, index) => {
            const page = index + 1;
            const active = currentPage === page;

            return `
                <button
                    type="button"
                    onclick="changePage(${page})"
                    aria-label="Ir para página ${page}"
                    aria-current="${active ? "page" : "false"}"
                    class="w-11 h-11 rounded-xl font-bold transition-all ${
                        active
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }"
                >
                    ${page}
                </button>
            `;
        }
    ).join("");
};

window.changePage = function (page) {
    const totalPages = Math.ceil(
        products.length / productsPerPage
    );

    if (
        !Number.isInteger(Number(page)) ||
        Number(page) < 1 ||
        Number(page) > totalPages
    ) {
        return;
    }

    currentPage = Number(page);

    window.renderProducts();

    const section =
        document.getElementById("product-grid-section") ||
        document.getElementById("product-grid");

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
};


/* =====================================================
   7. CONTROLE DOS PAINÉIS LATERAIS
   ===================================================== */

function syncOverlay() {
    const overlay = document.getElementById("menu-overlay");

    const mobileMenu = document.getElementById("mobile-menu");

    const cartSidebar = document.getElementById("cart-sidebar");

    if (!overlay) return;

    const menuOpen =
        mobileMenu &&
        !mobileMenu.classList.contains("translate-x-full");

    const cartOpen =
        cartSidebar &&
        !cartSidebar.classList.contains("translate-x-full");

    const shouldShow = Boolean(menuOpen || cartOpen);

    overlay.style.opacity = shouldShow ? "1" : "0";

    overlay.style.pointerEvents = shouldShow
        ? "auto"
        : "none";

    overlay.setAttribute(
        "aria-hidden",
        String(!shouldShow)
    );

    document.body.classList.toggle(
        "no-scroll",
        shouldShow
    );
}

function closeMobileMenu() {
    const menu = document.getElementById("mobile-menu");

    if (menu) {
        menu.classList.add("translate-x-full");
    }

    syncOverlay();
}

function openMobileMenu() {
    const menu = document.getElementById("mobile-menu");

    const cartSidebar = document.getElementById("cart-sidebar");

    if (cartSidebar) {
        cartSidebar.classList.add("translate-x-full");
    }

    if (menu) {
        menu.classList.remove("translate-x-full");
    }

    syncOverlay();
}

function closeCart() {
    const cartSidebar = document.getElementById("cart-sidebar");

    if (cartSidebar) {
        cartSidebar.classList.add("translate-x-full");
    }

    syncOverlay();
}

function openCart() {
    const cartSidebar = document.getElementById("cart-sidebar");

    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenu) {
        mobileMenu.classList.add("translate-x-full");
    }

    if (cartSidebar) {
        cartSidebar.classList.remove("translate-x-full");
    }

    syncOverlay();
}


/* =====================================================
   8. ADICIONAR PRODUTOS AO CARRINHO
   ===================================================== */

window.addToCart = function (id) {
    const item = products.find(product => {
        return String(product.id) === String(id);
    });

    if (!item) {
        console.warn("Produto não encontrado:", id);
        return;
    }

    cart.push(item);

    saveCart();

    window.updateUI();

    openCart();
};


/* =====================================================
   9. REMOVER PRODUTOS DO CARRINHO
   ===================================================== */

window.removeFromCart = function (index) {
    const position = Number(index);

    if (
        !Number.isInteger(position) ||
        position < 0 ||
        position >= cart.length
    ) {
        return;
    }

    cart.splice(position, 1);

    saveCart();

    window.updateUI();
};


/* =====================================================
   10. LIMPAR COMPLETAMENTE O CARRINHO
   ===================================================== */

window.clearCart = function () {
    // Esvazia o estado em memória.
    cart = [];

    // Atualiza o armazenamento local.
    saveCart();

    // Garante que o armazenamento contenha um array vazio.
    localStorage.setItem("aw_cart", "[]");

    // Atualiza quantidades, valores e produtos exibidos.
    window.updateUI();

    console.log(
        "Carrinho demonstrativo finalizado e limpo."
    );
};


/* =====================================================
   11. ATUALIZAÇÃO DA INTERFACE DO CARRINHO
   ===================================================== */

window.updateUI = function () {
    const total = getCartTotal();

    // Quantidade de produtos.
    document.querySelectorAll(
        "#cart-count, #cart-count-mobile"
    ).forEach(element => {
        element.textContent = cart.length;
    });

    // Total.
    const totalElement = document.getElementById("cart-total");

    if (totalElement) {
        totalElement.textContent = `R$ ${formatPrice(total)}`;
    }

    // Subtotal.
    const subtotalElement = document.getElementById(
        "cart-subtotal"
    );

    if (subtotalElement) {
        subtotalElement.textContent = `R$ ${formatPrice(total)}`;
    }

    // Produtos do carrinho.
    const container = document.getElementById("cart-items");

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center text-center py-12">

                <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                    <svg class="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            stroke-width="1.6"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M9 21h.01M17 21h.01"
                        />
                    </svg>
                </div>

                <h3 class="text-sm font-bold text-white">
                    Seu carrinho está vazio
                </h3>

                <p class="text-xs text-gray-500 mt-2 max-w-[230px] leading-6">
                    Explore nosso catálogo e adicione produtos para montar seu pedido.
                </p>

                <a
                    href="#product-grid-section"
                    id="cart-empty-continue"
                    class="mt-5 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
                >
                    EXPLORAR PRODUTOS
                </a>

            </div>
        `;

        return;
    }

    container.innerHTML = cart.map((item, index) => {
        const image = escapeHTML(
            getSafeImage(item.image)
        );

        const name = escapeHTML(
            item.name || "Produto"
        );

        return `
            <article class="flex items-center gap-4 bg-gray-900/80 p-3 rounded-xl border border-gray-800">

                <img
                    src="${image}"
                    alt="${name}"
                    class="w-14 h-14 object-contain bg-white/10 rounded-lg"
                    loading="lazy"
                    decoding="async"
                    onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}'"
                >

                <div class="flex-1 min-w-0">

                    <p class="text-[11px] font-bold text-white truncate">
                        ${name}
                    </p>

                    <p class="text-blue-400 text-xs font-bold mt-1">
                        R$ ${formatPrice(item.price)}
                    </p>

                </div>

                <button
                    type="button"
                    onclick="removeFromCart(${index})"
                    aria-label="Remover produto do carrinho"
                    class="text-gray-500 hover:text-red-500 p-2 transition-colors"
                >
                    ✕
                </button>

            </article>
        `;
    }).join("");
};


/* =====================================================
   12. FINALIZAÇÃO DEMONSTRATIVA
   ===================================================== */

function openDemoCheckout() {
    if (cart.length === 0) {
        alert("Adicione pelo menos um produto ao carrinho.");
        return;
    }

    const modal = document.getElementById(
        "demo-checkout-modal"
    );

    const itemsElement = document.getElementById(
        "demo-modal-items"
    );

    const totalElement = document.getElementById(
        "demo-modal-total"
    );

    if (!modal) {
        alert("Modal de finalização não encontrado.");
        return;
    }

    // Atualiza os dados da demonstração.
    if (itemsElement) {
        itemsElement.textContent = cart.length;
    }

    if (totalElement) {
        totalElement.textContent =
            `R$ ${formatPrice(getCartTotal())}`;
    }

    // Exibe o modal.
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("no-scroll");

    document.getElementById(
        "demo-modal-finish"
    )?.focus();
}

function closeDemoCheckout() {
    const modal = document.getElementById(
        "demo-checkout-modal"
    );

    if (!modal) return;

    modal.classList.add("hidden");
    modal.classList.remove("flex");

    modal.setAttribute("aria-hidden", "true");

    syncOverlay();
}


/* =====================================================
   13. CONFIRMAR FINALIZAÇÃO E LIMPAR CARRINHO
   ===================================================== */

function finishDemoCheckout() {
    if (cart.length === 0) {
        closeDemoCheckout();
        closeCart();
        return;
    }

    // 1. Fecha o modal.
    closeDemoCheckout();

    // 2. Limpa todos os produtos.
    window.clearCart();

    // 3. Fecha o painel lateral.
    closeCart();

    // 4. Atualiza o estado de rolagem.
    document.body.classList.remove("no-scroll");

    console.log(
        "Demonstração concluída. Carrinho zerado."
    );
}


/* =====================================================
   14. INICIALIZAÇÃO
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Carregar catálogo.
    loadProducts();

    // Restaurar interface do carrinho.
    window.updateUI();


    /* -----------------------------------------------
       MENU MOBILE
       ----------------------------------------------- */

    document.getElementById("menu-btn")?.addEventListener(
        "click",
        openMobileMenu
    );

    document.getElementById("close-btn")?.addEventListener(
        "click",
        closeMobileMenu
    );


    /* -----------------------------------------------
       ABRIR CARRINHO
       ----------------------------------------------- */

    document.getElementById("cart-btn")?.addEventListener(
        "click",
        openCart
    );

    document.getElementById(
        "cart-btn-mobile-trigger"
    )?.addEventListener(
        "click",
        openCart
    );


    /* -----------------------------------------------
       FECHAR CARRINHO
       ----------------------------------------------- */

    document.getElementById("close-cart")?.addEventListener(
        "click",
        closeCart
    );


    /* -----------------------------------------------
       SOBREPOSIÇÃO
       ----------------------------------------------- */

    document.getElementById("menu-overlay")?.addEventListener(
        "click",
        () => {
            closeMobileMenu();
            closeCart();
        }
    );


    /* -----------------------------------------------
       CONTINUAR COMPRANDO
       ----------------------------------------------- */

    document.getElementById(
        "cart-continue-shopping"
    )?.addEventListener(
        "click",
        closeCart
    );

    // Delegação: funciona mesmo quando o link é recriado
    // após a remoção do último produto.
    document.getElementById("cart-items")?.addEventListener(
        "click",
        event => {
            if (event.target.closest("#cart-empty-continue")) {
                closeCart();
            }
        }
    );


    /* -----------------------------------------------
       FINALIZAÇÃO DEMONSTRATIVA
       ----------------------------------------------- */

    document.getElementById("checkout-btn")?.addEventListener(
        "click",
        openDemoCheckout
    );


    /* -----------------------------------------------
       FECHAR MODAL SEM LIMPAR O CARRINHO
       ----------------------------------------------- */

    document.getElementById(
        "demo-modal-close"
    )?.addEventListener(
        "click",
        closeDemoCheckout
    );

    document.getElementById(
        "demo-modal-backdrop"
    )?.addEventListener(
        "click",
        closeDemoCheckout
    );


    /* -----------------------------------------------
       CONFIRMAR E LIMPAR O CARRINHO
       ----------------------------------------------- */

    document.getElementById(
        "demo-modal-finish"
    )?.addEventListener(
        "click",
        finishDemoCheckout
    );


    /* -----------------------------------------------
       FECHAR MENU AO NAVEGAR
       ----------------------------------------------- */

    document.getElementById("mobile-menu")?.addEventListener(
        "click",
        event => {
            if (event.target.closest("a[href]")) {
                closeMobileMenu();
            }
        }
    );


    /* -----------------------------------------------
       TECLA ESC
       ----------------------------------------------- */

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;

        const modal = document.getElementById(
            "demo-checkout-modal"
        );

        if (modal && !modal.classList.contains("hidden")) {
            closeDemoCheckout();
        }

        closeMobileMenu();
        closeCart();
    });


    console.log(
        "AW TECHNOLOGY: frontend v13.0 inicializado."
    );
});
