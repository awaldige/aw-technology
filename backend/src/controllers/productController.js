const prisma = require("../config/prisma");

// LISTAR TODOS
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' } // Opcional: traz os mais novos primeiro
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CRIAR PRODUTO
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    // Validação de segurança para o Neon não rejeitar
    if (!name || !price) {
      return res.status(400).json({ error: "Nome e preço são obrigatórios." });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || "", 
        price: parseFloat(price), // parseFloat é mais seguro para garantir decimais no banco
        image: image || "https://placehold.co/100?text=HW", // Garante fallback se vier vazio
      },
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ATUALIZAR
const updateProduct = async (req, res) => {
  try {
    // Ajustado para req.query para casar com o seu admin.html (`?id=${id}`)
    const id = req.query.id || req.params.id; 

    if (!id) {
      return res.status(400).json({ error: "ID do produto não informado." });
    }

    const { name, description, price, image } = req.body;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        image,
      },
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETAR
const deleteProduct = async (req, res) => {
  try {
    // Ajustado para req.query para casar com o seu admin.html (`?id=${id}`)
    const id = req.query.id || req.params.id;

    if (!id) {
      return res.status(400).json({ error: "ID do produto não informado." });
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Produto deletado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
