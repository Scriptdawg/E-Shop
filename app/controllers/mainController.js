const mailer = require("../middlewares/mailer.js");
//! MAIN ROUTES

//? INDEX
exports.index_get = (req, res) => {
  res.render("main/index", {
    subpageName: "Main",
    roles: req.session.roles,
  });
};

//? ABOUT - GET
exports.about_get = (req, res) => {
  res.render("main/about", {
    subpageName: "About",
    roles: req.session.roles,
  });
};

//? CONTACT - GET
exports.contact_get = (req, res) => {
  res.render("main/contact", {
    subpageName: "Contact Us",
    roles: req.session.roles,
    message: "",
  });
};
//? CONTACT - POST
exports.contact_post = (req, res) => {
  mailer({
    from: req.body.email,
    to: "pauloosterhoff@gmail.com",
    subject: req.body.subject,
    text: req.body.message,
  });

  mailer({
    from: "pauloosterhoff@gmail.com",
    to: req.body.email,
    subject: req.body.subject,
    text: "Thank you for contacting us.",
  });

  res.render("main/contact", {
    roles: req.session.roles,
    message: {
      subject: req.body.subject,
      message: req.body.message
      }
  });
};
