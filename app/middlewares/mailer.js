const nodemailer = require("nodemailer");

const mailer = (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pauloosterhoff@gmail.com",
      pass: process.env.EMAIL_PASS,
    },
  });
  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = mailer;
