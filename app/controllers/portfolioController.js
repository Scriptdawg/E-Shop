const mailer = require("../middlewares/mailer.js");
// PORTFOLIO ROUTES

// INDEX
exports.index_get = (req, res) => {
  res.render("portfolio/index", {
    message: ""
  });
};

// PORTFOLIO - POST
exports.index_post = (req, res) => {
  mailer({
    from: req.body.name + ' ' + req.body.email,
    to: "pauloosterhoff@gmail.com",
    subject: req.body.subject,
    text: req.body.message,
  });

  mailer({
    from: "pauloosterhoff@gmail.com",
    to: req.body.email,
    subject: req.body.subject,
    text: "Thank you for contacting us. We will reply soon.",
  });

  res.render("portfolio/index", {
    message: {
      subject: req.body.subject,
      message: req.body.message
      }
  });
};