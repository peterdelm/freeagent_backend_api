module.exports = (app) => {
  const goalies = require("../controllers/goalie.controller.js");

  var router = require("express").Router();

  // Create a new Goalie
  router.post("/", goalies.create);

  // Retrieve all Goalies
  router.get("/", goalies.findAll);

  // Retrieve all published Goalies
  router.get("/published", goalies.findAllPublished);

  // Retrieve a single Goalie with id
  router.get("/:id", goalies.findOne);

  // Update a Goalie with id
  router.put("/:id", goalies.update);

  // Delete a Goalie with id
  router.delete("/:id", goalies.delete);

  // Delete all Goalies
  router.delete("/", goalies.deleteAll);

  app.use("/api/goalies", router);
};
