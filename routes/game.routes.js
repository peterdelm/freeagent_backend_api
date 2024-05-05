module.exports = (app) => {
  const games = require("../controllers/game.controller.js");

  var router = require("express").Router();

  // Create a new Game
  router.post("/", games.create);

  // Retrieve all Games
  router.get("/", games.findAll);

  // Retrieve all published Games
  router.get("/active", games.findAllActive);

  router.get("/pending", games.findAllPending);

  router.get("/invites", games.findAllGameInvites);

  router.get("/acceptedplayerinvites", games.findAllAcceptedPlayerInvites);

  // Retrieve a single Games with id
  router.get("/:id", games.findOne);
  // Update a Game
  router.put("/joinGame", games.joinGame);

  router.put("/quitGame", games.quitGame);

  // Update a Game with an i
  router.put("/:id", games.update);

  // Delete a Game with id
  router.delete("/:id", games.delete);

  app.use("/api/games", router);
};
