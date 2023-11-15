// environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env" });
}

// requires ...
const cors = require("cors");
const createError = require("http-errors");
const express = require("express");
// const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const path = require("path");

// require routes
const administratorRouter = require("./app/routes/administrator");
const authRouter = require("./app/routes/auth");
const authorRouter = require("./app/routes/author");
const butcherRouter = require("./app/routes/butcher");
const libraryRouter = require("./app/routes/library");
const memberRouter = require("./app/routes/member");
const moderatorRouter = require("./app/routes/moderator");
const siteRouter = require("./app/routes/site");

// express application
const app = express();

//! variables
// global but can not change because no access to app
app.locals.title = "Coder's Cove";
app.locals.global = { general: "global.general" };
// accessed by any req, res, next function.
app.use(function (req, res, next) {
  res.locals.messages = "No messages.";
  res.locals.roles = "";
  res.locals.subpageName = "Coder's Cove";
  next();
});
const sharedVariable = function (req, res, next) {
  const sharedVariable = { sharedMessage: "Hello Message." };
  req.sharedVariable = sharedVariable;
  next();
};
app.use(sharedVariable);

// cors & cookies
const corsOptions = { origin: "http://localhost:3001" };
const cookieSession = require("cookie-session");
app.use(cors(corsOptions));
app.use(
  cookieSession({
    name: process.env.COOKIE_NAME,
    keys: [process.env.COOKIE_KEY_ONE, process.env.COOKIE_KEY_TWO],
    httpOnly: true,
  })
);

// database connection
main().catch((err) => console.log(err));
async function main() {
  mongoose.connect(process.env.DATABASE_URL);
}

// view engine setup
// app.set("layout", "layout/layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// use ...
app.use(express.json());
// app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "resources")));
app.use(express.urlencoded({ extended: true }));

// use routers
app.use("/", siteRouter);
app.use("/administrator", administratorRouter);
app.use("/auth", authRouter);
app.use("/author", authorRouter);
app.use("/butcher", butcherRouter);
app.use("/library", libraryRouter);
app.use("/member", memberRouter);
app.use("/moderator", moderatorRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // Render the error page.
  res.status(err.status || 500);
  res.render("error", {
    roles: req.session.roles,
  });
});

// exports
module.exports = app;
