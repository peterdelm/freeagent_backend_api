// const db = require("./queries");
var indexRouter = require("./routes/index");
var gamesRouter = require("./routes/game.routes");
var playersRouter = require("./routes/player.routes");
var sportsRouter = require("./routes/sports.routes");
var usersRouter = require("./routes/sports.routes");
var geocodingRouter = require("./routes/geocoding.routes");

const express = require("express");
const createError = require("http-errors");
const path = require("path");

const app = express();

// Set up mongoose connection
const Sequelize = require("sequelize");
const sequelize = new Sequelize("freeagent_database", "peter", "sudo", {
  host: "127.0.0.1",
  dialect: "postgres",
});

main().catch((err) => console.log(err));
async function main() {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
    });
}

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/games", gamesRouter);
app.use("/players", playersRouter);
app.use("/sports", sportsRouter);
app.use("/users", usersRouter);
app.use("/geocoding", geocodingRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
