module.exports = (app) => {
  const games = require("../controllers/game.controller.js");

  var router = require("express").Router();

  // Create a new Game
  router.post("/", games.create);

  // Retrieve all Games
  router.get("/", games.findAll);

  // Retrieve all published Games
  router.get("/published", games.findAllPublished);

  // Retrieve a single Games with id
  router.get("/:id", games.findOne);

  // Update a Games with id
  router.put("/:id", games.update);

  // Delete a Game with id
  router.delete("/:id", games.delete);

  // Delete all Games
  router.delete("/", games.deleteAll);

  app.use("/api/games", router);
};
