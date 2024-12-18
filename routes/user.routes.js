module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();
  const authenticateUserToken = require("../middleware/auth");

  // Public routes
  router.get("/verifyToken", users.verifyToken);
  router.post("/id", users.login);
  router.post("/", users.create);
  router.put("/", users.switchProfile);
  router.post("/reset", users.resetPassword);
  router.put("/reset", users.setNewPassword);
  router.put("/:userId/togglePlayerStatus", users.togglePlayerStatus);
  router.post("/refreshToken", users.refreshToken);
  router.post("/pushToken", users.updatePushToken);

  // Protected routes
  router.use(authenticateUserToken);
  router.get("/:id", users.findOne);
  router.get("/", users.getCurrentUser);

  app.use("/api/users", router);
};
