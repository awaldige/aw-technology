const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Rotas limpas (O controller se encarrega de ler o ?id= da URL)
router.get("/", getProducts);
router.post("/", createProduct);
router.put("/", updateProduct);     // <-- Removido o /:id
router.delete("/", deleteProduct);  // <-- Removido o /:id

module.exports = router;
