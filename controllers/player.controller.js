const db = require("../models");
const Player = db.players;
const Op = db.Sequelize.Op;

// Create and Save a new Player
exports.create = async (req, res) => {
  try {
    console.log("A Create Player Request has arrived");
    // Validate request
    if (!req.body.location) {
      res.status(400).send({
        messageOp: "address can not be empty!",
      });
      return;
    }

    const jwt = require("jsonwebtoken");
    const secretKey = process.env.SECRET;
    //FIND THE ID of the User
    console.log("Auth token is " + req.headers.authorization);
    const jwtFromHeader = req.headers.authorization.replace("Bearer ", "");
    console.log("jwtFromHeader is " + jwtFromHeader);

    // Decode and verify the JWT
    const userId = await jwt.verify(
      jwtFromHeader,
      secretKey,
      (err, decoded) => {
        if (err) {
          console.log("JWT verification failed");
        } else {
          const userId = decoded.userID;
          console.log("User ID is " + userId);

          return userId;
        }
      }
    );

    // Create a player
    const player = {
      gender: req.body.gender,
      calibre: req.body.calibre,
      location: req.body.location,
      sport: req.body.sport,
      sportId: req.body.sportId,
      travel_range: req.body.travelRange,
      position: req.body.position,
      bio: req.body.additional_info,
      userId: userId,
      is_active: true,
    };
    console.log(player);

    const newPlayer = await Player.create(player);

    // Save player in the database
    const response = {
      success: true, // Set the success property to true
      player: newPlayer,
      message: "Player Added",
    };
    res.status(200).send(response);
    console.log("Game Added");
  } catch (err) {
    console.log("Problem with request");
    console.log("err.name", err.name);
    console.log("err.message", err.message);
    console.log("err.errors", err.errors);
    //   err.errors.map((e) => console.log(e.message)); // The name must contain between 2 and 100 characters.

    res.status(500).send({
      message: err.message || "Some error occurred while creating the player.",
    });
  }
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
  console.log("Player.findOne Called");
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

exports.findAllUserPlayers = async (req, res) => {
  console.log("FindAll User Players Request Received");

  try {
    const jwt = require("jsonwebtoken");
    const secretKey = process.env.SECRET;
    const jwtFromHeader = req.headers.authorization.replace("Bearer ", "");

    // Decode and verify the JWT
    const decoded = jwt.verify(jwtFromHeader, secretKey);
    const userId = decoded.userID;

    console.log("JWT verification succeeded. User ID is " + userId);

    //FIND ACTIVE GAMES BELONGING TO THE USER

    console.log("Finding player profiles for user " + userId + "...");
    const players = await Player.findAll({
      where: { userId: userId },
    });
    let message = "";
    if (players.length === 0) {
      message = "No Player Profiles found.";
    } else {
      message = "Players found.";
    }
    console.log("Active players are " + players);

    const response = {
      success: true,
      players: players,
      message: message,
    };
    console.log(response.players);
    res.status(200).send(response);
  } catch (err) {
    console.log("JWT verification failed");
    res.status(401).send({ message: "Unauthorized" });
  }
};
