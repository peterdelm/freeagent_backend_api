module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Retrieve all Sports
  router.post("/id", users.login);
  router.post("/", users.create);
  router.put("/", users.switchProfile);
  router.get("/", users.getCurrentUser);

  app.use("/api/users", router);
};
