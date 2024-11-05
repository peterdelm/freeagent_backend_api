module.exports = (app) => {
  const games = require("../controllers/game.controller.js");

  var router = require("express").Router();
  const authenticateUserToken = require("../middleware/auth");
  //public
  router.get("/", games.findAll);
  router.get("/pending", games.findAllPending);

  //protected routes
  router.use(authenticateUserToken);
  router.get("/invites", games.findAllGameInvites);
  router.get("/acceptedplayerinvites", games.findAllAcceptedPlayerInvites);
  router.get("/active", games.findAllActive);
  router.post("/", games.create);
  router.put("/quitGame", games.quitGame);
  router.get("/:id", games.findOne);
  router.put("/:id", games.update);
  router.put("/joinGame/:id", games.joinGame);
  router.delete("/:id", games.delete);

  app.use("/api/games", router);
};
