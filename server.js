// Environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env" });
}

// Requires ...
const cors = require("cors");
const createError = require("http-errors");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const path = require("path");

// Require routes
const mainRouter = require("./app/routes/main");
const publicRouter = require("./app/routes/public");
const authRouter = require("./app/routes/auth");
const memberRouter = require("./app/routes/member");
const authorRouter = require("./app/routes/author");
const moderatorRouter = require("./app/routes/moderator");
const administratorRouter = require("./app/routes/administrator");

// Express application
const app = express();

// Global but can not change because no access to app
app.locals.title = "E-Shop";
app.locals.global = { general: "global.general" };
// Accessed by any req, res, next function.
app.use(function (req, res, next) {
  res.locals.messages = "No messages.";
  res.locals.roles = "";
  next();
});
const sharedVariable = function (req, res, next) {
  const sharedVariable = { sharedMessage: "Hello Message." };
  req.sharedVariable = sharedVariable;
  next();
};
app.use(sharedVariable);

// Cors & Cookies
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

// Database connection
main().catch((err) => console.log(err));
async function main() {
  mongoose.connect(process.env.DATABASE_URL);
}

// View engine setup
app.set("layout", "layouts/layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use ...
app.use(express.json());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Use routers
app.use("/", mainRouter);
app.use("/auth", authRouter);
app.use("/public", publicRouter);
app.use("/member", memberRouter);
app.use("/author", authorRouter);
app.use("/moderator", moderatorRouter);
app.use("/administrator", administratorRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // Render the error page.
  res.status(err.status || 500);
  res.render("error", {});
});

// Exports
module.exports = app;
