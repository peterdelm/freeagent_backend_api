const db = require("../models");
const Game = db.games;
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
  };

  // Save Game in the database
  Game.create(game)
    .then((data) => {
      res.send(data);
      console.log("Game Added");
    })
    .catch((err) => {
      console.log("Problem with request");
      console.log("err.name", err.name);
      console.log("err.message", err.message);
      console.log("err.errors", err.errors);
      err.errors.map((e) => console.log(e.message)); // The name must contain between 2 and 100 characters.

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

// find all published Game
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
