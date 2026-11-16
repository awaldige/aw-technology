
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Autenticação necessária."
      });
    }

    const token = authorization.slice(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET não configurado.");

      return res.status(500).json({
        error: "Serviço de autenticação indisponível."
      });
    }

    const decoded = jwt.verify(token, secret, {
      issuer: "aw-technology"
    });

    if (decoded.role !== "admin") {
      return res.status(403).json({
        error: "Acesso não autorizado."
      });
    }

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      error: "Token inválido ou expirado."
    });
  }
};
