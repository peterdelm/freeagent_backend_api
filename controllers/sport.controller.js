const db = require("../models");
const Sport = db.sports;

// Retrieve all Sports from the database.

//Make this asyncronous
exports.findAll = async (req, res) => {
  try {
    const sports = await Sport.findAll();
    if (sports) {
      res.status(200).send({
        sports: sports,
      });
    } else {
      res.status(500).send({
        error: "Internal Server Error. Sports not found.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
  (data) => {
    res.send(data);
  };
};

// Create and Save a new Sport
exports.create = (req, res) => {
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

// Find a single Sport with an id
exports.findOne = (req, res) => {
  console.log("Sports.findOne Called");
  const id = req.params.id;

  Sport.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving sport with id=" + id,
      });
    });
};
