const PDFDocument = require('pdfkit');
const fs = require('fs');

module.exports = function (path, data) {
  const pdfDoc = new PDFDocument;
  pdfDoc.pipe(fs.createWriteStream(path));
  
  pdfDoc.registerFont('ArialCyrMT-Bold', 'D:\\Diploma_project\\EMS_3\\report\\Arial_Cyr.ttf')
  
  pdfDoc.font('ArialCyrMT-Bold').fontSize(24)
    .text("Запит на відпустку\n", {align: 'center'})
  pdfDoc.fontSize(14).text(`Тип: ${data.type}`)
  pdfDoc.text(`Статус запиту: ${data.status}`)
  pdfDoc.text(`Період: ${data.startDate} - ${data.endDate} (${data.days} днів)`)
  pdfDoc.text(`\nПояснюючий текст:`)
  pdfDoc.text(data.description)
  pdfDoc.fontSize(18)
    .text(`\nДані працівника, що створив запит`, {underline: true})
  pdfDoc.fontSize(14)
    .text(`Ім'я: ${data.author.firstName} ${data.author.lastName} (${data.author.username})`)
  pdfDoc.text(`Проєкт: ${data.project}`)
  pdfDoc.text(`Керівник працівника: ${data.author.supervisor}`)
  pdfDoc.text(`Кількість днів, доступна працівнику для відпустки на даний момент:`)
  pdfDoc.text(`- оплачувана: ${data.author.leavesAvailable.paid}`)
  pdfDoc.text(`- неоплачувана: ${data.author.leavesAvailable.unpaid}`)
  pdfDoc.text(`- лікарняний: ${data.author.leavesAvailable.illness}`)
  
  pdfDoc.end();
}
