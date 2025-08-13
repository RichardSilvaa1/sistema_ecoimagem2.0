const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

module.exports = {
  async toExcel({ expenses = [], revenues = [] }) {
    const wb = new ExcelJS.Workbook();
    const wsE = wb.addWorksheet('Expenses');
    const wsR = wb.addWorksheet('Revenues');

    wsE.addRow(['ID','Categoria','Descrição','Valor','Forma Pagamento','Status','Parcelas','Vencimento','Pagamento']);
    expenses.forEach(e => {
      wsE.addRow([e.id, e.FinancialCategory ? e.FinancialCategory.name : '', e.description, Number(e.amount), e.payment_method, e.status, e.installments, e.due_date, e.payment_date]);
    });

    wsR.addRow(['ID','Descrição','Valor','Forma Pagamento','Status','Parcelas','Vencimento','Pagamento']);
    revenues.forEach(r => {
      wsR.addRow([r.id, r.description, Number(r.amount), r.payment_method, r.status, r.installments, r.due_date, r.payment_date]);
    });

    const buffer = await wb.xlsx.writeBuffer();
    return buffer;
  },

  async toPDF({ expenses = [], revenues = [] }) {
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    doc.fontSize(16).text('Financial Export', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text('Expenses');
    expenses.forEach(e => {
      doc.text(`${e.id} | ${e.FinancialCategory ? e.FinancialCategory.name : ''} | ${e.description} | ${e.amount} | ${e.status}`);
    });

    doc.addPage();
    doc.fontSize(12).text('Revenues');
    revenues.forEach(r => {
      doc.text(`${r.id} | ${r.description} | ${r.amount} | ${r.status}`);
    });

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
    });
  }
};
