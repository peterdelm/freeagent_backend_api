module.exports = (app) => {
  const players = require("../controllers/player.controller.js");

  var router = require("express").Router();
  const authenticateUserToken = require("../middleware/auth");
  //public
  router.get("/", players.findAll);
  router.get("/published", players.findAllPublished);
  router.put("/:id", players.update);
  router.delete("/:id", players.delete);
  router.delete("/", players.deleteAll);

  //protected routes
  router.use(authenticateUserToken);
  router.get("/playerRoster", players.findAllUserPlayers);
  router.get("/:id", players.findOne);
  router.post("/", players.create);

  app.use("/api/players", router);
};
