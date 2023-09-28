module.exports = (app) => {
  const geocoding = require("../controllers/geocoding.controller.js");

  var router = require("express").Router();

  // Retrieve all Games
  router.get("/", geocoding.autocomplete);

  app.use("/api/geocoding", router);
};
