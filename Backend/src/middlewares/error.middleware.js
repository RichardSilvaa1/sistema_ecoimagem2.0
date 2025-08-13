 // Middleware para tratamento de erros genéricos
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack); // Loga o erro no console para depuração
    res.status(500).json({ error: 'Erro interno do servidor' }); // Responde com erro 500
  };
  
  // Exporta o middleware
  module.exports = errorMiddleware;
