module.exports = (app) => {
  const reviews = require("../controllers/review.controller.js");

  var router = require("express").Router();
  const authenticateUserToken = require("../middleware/auth");
  //public

  //protected routes
  router.use(authenticateUserToken);
  router.post("/", reviews.create);

  app.use("/api/reviews", router);
};
