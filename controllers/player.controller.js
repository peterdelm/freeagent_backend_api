require("dotenv").config();
const db = require("../models");
const Player = db.players;
const Location = db.locations;

const Op = db.Sequelize.Op;

const createLocation = async (locationString, playerId) => {
  console.log("Calling createLocation");
  console.log("with playerId, ", playerId);

  try {
    const coordinates = await getCoordinates(locationString);
    console.log("Calling getCoordinates");

    if (coordinates) {
      console.log("Latitude:", coordinates.latitude);
      console.log("Longitude:", coordinates.longitude);
      const newLocation = await createNewLocation(
        playerId,
        coordinates,
        locationString
      );
      return newLocation;
    } else {
      console.log("Coordinates not found.");
    }
  } catch (error) {
    console.error("Error creating location:", error);
  }
};

const getCoordinates = async (locationString) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        locationString
      )}&key=AIzaSyDbPFYhBsYTcD_ala9nEOjlM_bkFyALMuI`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw new Error("Failed to fetch coordinates.");
  }

  return null;
};

const createNewLocation = async (playerId, coordinates, locationString) => {
  console.log("Calling createNewLocation");
  console.log("playerId is:", playerId);

  const locationInfo = {
    playerId: playerId,
    longitude: coordinates.longitude,
    latitude: coordinates.latitude,
    address: locationString,
  };
  console.log("locationInfo is", locationInfo);

  try {
    const newLocation = await Location.create(locationInfo);
    console.log("Location created:", newLocation);

    return newLocation;
  } catch (error) {
    console.error("Error creating location:", error.message);
  }
};

// Create and Save a new Player
exports.create = async (req, res) => {
  try {
    console.log("A Create Player Request has arrived");
    // Validate request
    if (!req.body.location) {
      console.log("address can not be empty!");

      res.status(400).send({
        messageOp: "address can not be empty!",
      });
      return;
    }
    //FIND THE ID of the User
    console.log("Auth token is " + req.headers.authorization);

    // Decode and verify the JWT
    // const userId = req.body.userId;
    const userId = req.user.userID;

    console.log("userId is", userId);

    // Create a player
    const player = {
      gender: req.body.gender,
      calibre: req.body.calibre,
      location: req.body.location,
      sport: req.body.sport,
      travelRange: req.body.travelRange,
      position: req.body.position,
      bio: req.body.additionalInfo,
      userId: userId,
      isActive: true,
    };
    console.log(player);

    const newPlayer = await Player.create(player);
    const newLocation = await createLocation(player.location, newPlayer.id);

    // Save player in the database
    const response = {
      success: true, // Set the success property to true
      player: newPlayer,
      location: newLocation,
      message: "Player Added",
    };
    res.status(200).send(response);
    console.log("Player Added");
  } catch (err) {
    console.log("Problem with request");
    console.log("err.name", err.name);
    console.log("err.message", err.message);
    console.log("err.errors", err.errors);
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
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving player with id=" + id + err,
      });
    });
};

// Update a player by the id in the request
exports.update = async (req, res) => {
  console.log("Player.update request received");
  try {
    console.log(req.body);
    const playerId = req.params.id;
    console.log("BoDy is ", req.body);
    //if the value of calibre, location, position, gender is blank, use the original value
    const { calibre, location, travelRange, gender, bio, position } = req.body;

    const player = await Player.findByPk(playerId);
    if (!player) {
      console.log("Player not found with id" + playerId);
      return res.status(404).json({ error: "Player not found." });
    }
    //create an object to hold any changes
    const updates = {};

    if (typeof calibre !== "undefined" && calibre.trim() !== "") {
      updates.calibre = calibre;
    }
    if (typeof location !== "undefined" && location.trim() !== "") {
      updates.location = location;
    }
    if (typeof travelRange !== "undefined" && travelRange.trim() !== "") {
      updates.travelRange = travelRange;
    }
    if (typeof gender !== "undefined" && gender.trim() !== "") {
      updates.gender = gender;
    }
    if (typeof bio !== "undefined" && bio.trim() !== "") {
      updates.bio = bio;
    }
    if (typeof position !== "undefined" && position.trim() !== "") {
      updates.position = position;
    }
    if (Object.keys(updates).length > 0) {
      Player.update(updates, {
        where: { id: playerId },
      })
        .then((num) => {
          if (num == 1) {
            res.send({
              success: true,
              message: "player was updated successfully.",
            });
          } else {
            console.log("Problem with player.update");
            res.send({
              message: `Cannot update player with id=${playerId}. Maybe player was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating player with id=" + playerId,
          });
        });
    } else {
      res.send({
        success: true,
        message: "No Changes to Player Were Made",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
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
    // Decode and verify the JWT

    const userId = req.user.userID;

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
