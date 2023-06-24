module.exports = (app) => {
  const sports = require("../controllers/sport.controller.js");

  var router = require("express").Router();

  // Retrieve all Sports
  router.get("/", sports.findAll);
  router.post("/", sports.create);

  // // Retrieve a single Sport with id
  // router.get("/:id", sports.findOne);

  app.use("/api/sports", router);
};
