const db = require("../models");
const Player = db.players;
const Op = db.Sequelize.Op;

// Create and Save a new Player
exports.create = (req, res) => {
  console.log("A request has arrived");
  // Validate request
  if (!req.body.address) {
    res.status(400).send({
      messageOp: "address can not be empty!",
    });
    return;
  }

  // Create a player
  const player = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    address: req.body.address,
    gender: req.body.gender,
    birthdate: req.body.birthdate,
    years_played: req.body.years_played,
    personal_calibre: req.body.personal_calibre,
    desired_calibre: req.body.desired_calibre,
    travel_range: req.body.travel_range,
    game_types: req.body.game_types,
    bio: req.body.bio,
  };

  // Save player in the database
  Player.create(player)
    .then((data) => {
      res.send(data);
      console.log("player Added");
    })
    .catch((err) => {
      console.log("Problem with request");
      console.log("err.name", err.name);
      console.log("err.message", err.message);
      console.log("err.errors", err.errors);
      //   err.errors.map((e) => console.log(e.message)); // The name must contain between 2 and 100 characters.

      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the player.",
      });
    });
};

// Retrieve all players from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Player.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving players.",
      });
    });
};

// Find a single player with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Player.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving player with id=" + id,
      });
    });
};

// Update a player by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Player.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "player was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update player with id=${id}. Maybe player was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating player with id=" + id,
      });
    });
};

// Delete a player with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Player.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Player was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete player with id=${id}. Maybe player was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete player with id=" + id,
      });
    });
};

// Delete all players from the database.
exports.deleteAll = (req, res) => {
  Player.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} players were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all players.",
      });
    });
};

// find all published player
exports.findAllPublished = (req, res) => {
  Player.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving players.",
      });
    });
};
