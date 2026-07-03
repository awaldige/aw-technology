const prisma = require("../config/prisma");

// LISTAR TODOS
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CRIAR PRODUTO
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        image,
      },
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ATUALIZAR
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETAR
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

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
