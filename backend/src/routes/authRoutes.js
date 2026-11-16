
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// LOGIN ADMINISTRATIVO
router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        error: "Informe a senha."
      });
    }

    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    const jwtSecret = process.env.JWT_SECRET;

    if (!passwordHash || !jwtSecret) {
      console.error("Credenciais administrativas não configuradas.");

      return res.status(500).json({
        error: "Autenticação indisponível."
      });
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      passwordHash
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        error: "Senha inválida."
      });
    }

    const token = jwt.sign(
      {
        role: "admin"
      },
      jwtSecret,
      {
        expiresIn: "4h",
        issuer: "aw-technology"
      }
    );

    return res.json({
      message: "Autenticação realizada.",
      token,
      role: "admin"
    });

  } catch (error) {
    console.error("Erro no login:", error.message);

    return res.status(500).json({
      error: "Erro interno na autenticação."
    });
  }
});

module.exports = router;
