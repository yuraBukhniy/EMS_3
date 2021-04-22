const nodemailer = require('nodemailer')
const config = require('config');

module.exports = async function ({ firstName, lastName, username, password, email }) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.get('emailUser'),
      pass: config.get('emailPassword'),
    },
  })
  await transporter.sendMail({
    from: '"EMS Administration" <yuriibuhn@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Реєстрація нового користувача", // Subject line
    html: `
        <h3>Привіт, ${firstName} ${lastName}!</h3>
        <p>Ваші дані для входу в систему:</p>
        <ul>
          <li>Ім'я користувача: ${username}</li>
          <li>Пароль: ${password}</li>
        </ul>
      `, // html body
  });
}