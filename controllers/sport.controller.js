const db = require("../models");
const Game = db.games;
const Sport = db.sports;
const Op = db.Sequelize.Op;

// Retrieve all Sports from the database.

exports.findAll = (req, res) => {
  Sport.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

// Create and Save a new Sport
exports.create = (req, res) => {
  console.log("A request has arrived");
  console.log(req.body.sport);
  // Validate request
  if (!req.body.sport) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Sport
  const sport = {
    sport: req.body.sport,
    position: req.body.position,
    game_length: req.body.game_length,
    calibre: req.body.calibre,
    game_type: req.body.game_type,
    gender: req.body.gender,
  };

  // Save Game in the database
  Sport.create(sport)
    .then((data) => {
      res.send(data);
      console.log("Sport Added");
    })
    .catch((err) => {
      console.log("Problem with request");
      console.log("err.name", err.name);
      console.log("err.message", err.message);
      console.log("err.errors", err.errors);
      // err.errors.map((e) => console.log(e.message)); // The name must contain between 2 and 100 characters.

      res.status(500).send({
        message: err.message || "Some error occurred while creating the Game.",
      });
    });
};
