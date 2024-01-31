module.exports = (app) => {
  const message = require("../controllers/message.controller.js");

  var router = require("express").Router();

  // Retrieve all Sports
  router.get("/:id", message.findOne);
  router.get("/", message.findAll);
  router.post("/", massage.create);

  // // Retrieve a single Sport with id
  // router.get("/:id", sports.findOne);

  app.use("/api/message", router);
};
