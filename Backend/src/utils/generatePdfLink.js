 // Função para gerar links públicos para PDFs
const generatePdfLink = (exameId) => {
    return `${process.env.BASE_URL}/exames/public/${exameId}/pdf`; // Monta o link
  };
  
  // Exporta a função
  module.exports = { generatePdfLink };
