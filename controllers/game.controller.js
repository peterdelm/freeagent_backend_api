const db = require("../models");
const Game = db.games;
const Goalie = db.goalies;
const Op = db.Sequelize.Op;

// Create and Save a new Game
exports.create = (req, res) => {
  console.log("A request has arrived");
  // Validate request
  if (!req.body.location) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Game
  const game = {
    location: req.body.location,
    date: req.body.date,
    time: req.body.time,
    game_length: req.body.game_length,
    calibre: req.body.calibre,
    game_type: req.body.game_type,
    gender: req.body.gender,
    team_name: req.body.team_name,
    additional_info: req.body.additional_info,
    is_active: true,
  };

  // Save Game in the database
  Game.create(game)
    .then((data) => {
      const response = {
        success: true, // Set the success property to true
        data: data, // Assign the created game object to the data property
        message: "Game Added",
      };
      res.status(200).send(response);
      console.log("Game Added");
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

// Retrieve all Games from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Game.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

// Retrieve all Active Games from the database.
exports.findAllActive = (req, res) => {
  console.log("FindAll Request Received");
  Game.findAll({ where: { is_active: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

// Find a single Game with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Game.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Game with id=" + id,
      });
    });
};

// Update a Game by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Game.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Game was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Game with id=${id}. Maybe Game was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Game with id=" + id,
      });
    });
};

// Delete a Game with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Game.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Game was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Game with id=${id}. Maybe Game was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Game with id=" + id,
      });
    });
};

// Delete all Games from the database.
exports.deleteAll = (req, res) => {
  Games.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Games were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Games.",
      });
    });
};

// find all published Games
exports.findAllPublished = (req, res) => {
  Game.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Games.",
      });
    });
};

//Find a goalie who meets the criteria
exports.findTheRightGoalie = (req, res) => {
  const game = {
    location: req.body.location,
    date: req.body.date,
    time: req.body.time,
    game_length: req.body.game_length,
    calibre: req.body.calibre,
    game_type: req.body.game_type,
    gender: req.body.gender,
    team_name: req.body.team_name,
    additional_info: req.body.additional_info,
  };

  const gender = game.gender;
  const calibre = game.calibre;
  const game_type = game.game_type;

  console.log("Request for goalie received");

  const potential_goalies = Goalie.findAll({
    where: { gender: gender, personal_calibre: calibre },
    //where GAME_LOCATION to ADDRESS <= TRAVEL_RANGE (call this distanceBetween)
  });

  potential_goalies
    .then((data) => {
      res.send(data[0]); //sends the first goalie in the array
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Games.",
      });
    });
  //create game
  //find goalie where: calibre, gender, gametype
};
