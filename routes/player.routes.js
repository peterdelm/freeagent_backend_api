module.exports = (app) => {
  const players = require("../controllers/player.controller.js");

  var router = require("express").Router();

  // Create a new Player
  router.post("/", players.create);

  // Retrieve all players
  router.get("/", players.findAll);

  // Retrieve all published players
  router.get("/published", players.findAllPublished);
  // Retrieve a single Player with id
  router.get("/playerRoster", players.findAllUserPlayers);

  // Retrieve a single Player with id
  router.get("/:id", players.findOne);

  // Update a Player with id
  router.put("/:id", players.update);

  // Delete a Player with id
  router.delete("/:id", players.delete);

  // Delete all players
  router.delete("/", players.deleteAll);

  app.use("/api/players", router);
};
