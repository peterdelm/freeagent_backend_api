module.exports = (app) => {
  const geocoding = require("../controllers/geocoding.controller.js");

  var router = require("express").Router();

  // Retrieve all Games
  router.post("/", geocoding.autocomplete);

  app.use("/api/geocoding", router);
};
