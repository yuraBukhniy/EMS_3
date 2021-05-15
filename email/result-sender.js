const nodemailer = require('nodemailer')
const config = require('config');

module.exports = async function ({ firstName, lastName, email, seniority, position }, passed) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.get('emailUser'),
      pass: config.get('emailPassword'),
    },
  })
  const vacancy = seniority ? seniority + " " + position : position
  await transporter.sendMail({
    from: `"EMS Administration" <${config.get('emailUser')}>`,
    to: email,
    subject: "Результат співбесіди",
    html: passed ? `
        <h3>Привіт, ${firstName} ${lastName}!</h3>
        <p>
          Вітаємо! Ви успішно пройшли співбесіду на вакансію <b>${vacancy}</b>.
          Ви отримали пропозицію працевлаштування у нашій компанії.
          <br>
          Надішліть листа з вашою відповіддю: чи приймаєте ви пропозицію, чи ні.
        </p>
        <p>Гарного дня!</p>
      ` : `
        <h3>Привіт, ${firstName} ${lastName}!</h3>
        <p>
          На жаль, ви не пройшли співбесіду на вакансію <b>${vacancy}</b>.
          Надіємось, наступного разу пощастить!
        </p>
        <p>Гарного дня!</p>
      `,
  });
}