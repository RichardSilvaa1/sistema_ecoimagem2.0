const { app, inicializarBanco } = require('./app');

// Define a porta do servidor
const PORT = process.env.PORT || 3000;

// Inicia o servidor após inicializar o banco
inicializarBanco()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  });