// npm install nodemailer
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your_email@example.com', // your email address
    pass: 'your_password' // your email password
  }
});

let mailOptions = {
  from: '"Sender Name" <your_email@example.com>',
  to: 'recipient@example.com', // list of receivers
  subject: 'Hello ✔', // Subject line
  text: 'Hello world?', // plain text body
  html: '<b>Hello world?</b>' // html body
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});
