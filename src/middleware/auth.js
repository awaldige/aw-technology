module.exports = (req, res, next) => {
  console.log("Middleware rodando...");
  next();
};