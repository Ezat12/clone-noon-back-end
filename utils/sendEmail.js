const transporter = require("nodemailer");

const sendEmail = async (options) => {
  const transportes = transporter.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transportes.sendMail({
    from: "E-Shop App <ezatelbery164@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  });
};

module.exports = sendEmail;
