// const db = require("../queries");

const express = require("express");
const app = express();
const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/catalog");
});

module.exports = app;
