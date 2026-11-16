
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Consulta pública
router.get("/", getProducts);

// Operações exclusivas do administrador
router.post("/", authMiddleware, createProduct);
router.put("/", authMiddleware, updateProduct);
router.delete("/", authMiddleware, deleteProduct);

module.exports = router;
