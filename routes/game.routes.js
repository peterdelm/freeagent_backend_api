module.exports = (app) => {
  const games = require("../controllers/game.controller.js");

  var router = require("express").Router();
  const authenticateUserToken = require("../middleware/auth");
  //public
  // Create a new Game
  router.post("/", games.create);

  // Retrieve all Games
  router.get("/", games.findAll);
  router.get("/pending", games.findAllPending);
  router.put("/joinGame", games.joinGame);
  router.put("/quitGame", games.quitGame);
  router.put("/:id", games.update);
  router.delete("/:id", games.delete);

  //protected routes
  router.use(authenticateUserToken);
  router.get("/:id", games.findOne);
  router.get("/invites", games.findAllGameInvites);
  router.get("/acceptedplayerinvites", games.findAllAcceptedPlayerInvites);
  router.get("/active", games.findAllActive);

  app.use("/api/games", router);
};
