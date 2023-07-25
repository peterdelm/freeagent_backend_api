module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Retrieve all Sports
  router.get("/", users.retrieveToken);
  router.post("/id", users.login);
  router.post("/", users.create);

  app.use("/api/users", router);
};
