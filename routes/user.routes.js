module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Retrieve all Sports
  router.post("/id", users.login);
  router.post("/", users.create);
  router.put("/", users.switchProfile);
  router.get("/", users.getCurrentUser);
  router.post("/reset", users.resetPassword);
  router.put("/reset", users.setNewPassword);

  app.use("/api/users", router);
};
