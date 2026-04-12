// --- 1. Banco de Dados AW TECHNOLOGY (Sincronização Forçada Versão 10.0) ---
const loadProducts = () => {
    const defaultProducts = [
        { id: 101, name: "HD WD Purple Surveillance 6TB 3.5\"", price: 1229, image: "https://m.media-amazon.com/images/I/81S2Wb17P4L._AC_SL1500_.jpg", description: "Engenharia de elite: componente selecionado pela AW TECHNOLOGY para eliminar gargalos." },
        { id: 102, name: "Placa de Vídeo Inno3d RTX 5070", price: 6300, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400", description: "Desempenho de próxima geração para setups de ultra-performance." },
        { id: 103, name: "Kit Upgrade i9-14900K + B760M", price: 5200, image: "https://images.unsplash.com/photo-1591405351990-4726e33df58d?auto=format&fit=crop&q=80&w=400", description: "O coração do seu setup. Máximo poder de processamento." },
        { id: 104, name: "HD Externo Expansion Seagate 4TB", price: 1300, image: "https://m.media-amazon.com/images/I/81tjLksKixL._AC_SL1500_.jpg", description: "Espaço de sobra para seus projetos e games." },
        { id: 105, name: "ASUS ROG Strix RTX 4090", price: 13350, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400", description: "A rainha das GPUs. Performance sem compromissos." },
        { id: 106, name: "MSI Gaming Slim RTX 4070 Ti Super", price: 8200, image: "https://m.media-amazon.com/images/I/71R2oIsc9HL._AC_SL1500_.jpg", description: "Potência em formato slim para gabinetes compactos." },
        { id: 107, name: "AMD Ryzen 7 7800X3D", price: 2250, image: "https://m.media-amazon.com/images/I/51fS8rT9uWL._AC_SL1000_.jpg", description: "A melhor CPU para jogos do mundo." },
        { id: 108, name: "Intel Core i7-14700K", price: 2800, image: "https://m.media-amazon.com/images/I/61Sno74HAnL._AC_SL1200_.jpg", description: "Equilíbrio perfeito entre produtividade e jogos." },
        { id: 109, name: "Corsair Dominator Titanium DDR5", price: 2220, image: "https://m.media-amazon.com/images/I/71+v8O6NgeL._AC_SL1500_.jpg", description: "Memória de elite com estética insuperável." },
        { id: 110, name: "SSD Samsung 990 Pro 2TB", price: 3300, image: "https://m.media-amazon.com/images/I/61p-K8u+e9L._AC_SL1500_.jpg", description: "Velocidade de leitura absurda para tempos de loading zero." },
        { id: 111, name: "Water Cooler Kraken Elite 360", price: 2250, image: "https://m.media-amazon.com/images/I/71XG83O50KL._AC_SL1500_.jpg", description: "Refrigeração premium com tela LCD customizável." },
        { id: 112, name: "Lian Li Uni Fan SL-LCD 120", price: 352, image: "https://m.media-amazon.com/images/I/61Uv5vVq14L._AC_SL1500_.jpg", description: "Fans de alta performance com telas LCD integradas." },
        { id: 113, name: "Gabinete Hyte Y70 Touch Infinite", price: 3920, image: "https://m.media-amazon.com/images/I/71Zp+T+f2vL._AC_SL1500_.jpg", description: "Gabinete panorâmico com tela touch 4K integrada." },
        { id: 114, name: "Lian Li O11 Vision Compact", price: 1280, image: "https://m.media-amazon.com/images/I/61R-8C9F-5L._AC_SL1500_.jpg", description: "Design visionário com três vidros temperados." },
        { id: 115, name: "Water Cooler MSI MAG Coreliquid", price: 920, image: "https://m.media-amazon.com/images/I/61qYF8Y0f2L._AC_SL1500_.jpg", description: "Estética clean em branco com refrigeração eficiente." },
        { id: 116, name: "Gabinete Lian Li PC-O11 Dynamic XL", price: 1800, image: "https://m.media-amazon.com/images/I/71Zp+T+f2vL._AC_SL1500_.jpg", description: "O clássico dos entusiastas em versão estendida." },
        { id: 117, name: "Fonte Corsair RM1000x Shift", price: 1450, image: "https://m.media-amazon.com/images/I/718V3S-K0AL._AC_SL1500_.jpg", description: "Energia estável e limpa com cabos laterais inovadores." },
        { id: 118, name: "Teclado Custom Mecânico Elite", price: 1200, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400", description: "Experiência de digitação única para setups high-end." }
    ];

    const CURRENT_DB_VERSION = "10.0"; // Versão elevada para forçar o mobile
    const savedVersion = localStorage.getItem('aw_db_version');

    if (savedVersion !== CURRENT_DB_VERSION) {
        // MUITO IMPORTANTE: Limpa o lixo antigo do celular antes de colocar o novo
        localStorage.clear(); 
        localStorage.setItem('aw_products', JSON.stringify(defaultProducts));
        localStorage.setItem('aw_db_version', CURRENT_DB_VERSION);
        console.log("Database atualizada para v10.0");
        return defaultProducts;
    }

    const savedProducts = JSON.parse(localStorage.getItem('aw_products'));
    return savedProducts || defaultProducts;
};

// --- Na função renderProducts, mude a parte da imagem para isso: ---
// Procure por productGrid.innerHTML e substitua a parte da imagem:

/* DICA: Removi o loading="lazy" e usei links limpos 
   para garantir que o mobile carregue de primeira.
*/
<img src="${product.image}"  
     alt="${product.name}"  
     class="max-w-full max-h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
     onerror="this.src='https://placehold.co/400x400/1f2937/white?text=AW+TECH'">
