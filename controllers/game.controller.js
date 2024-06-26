require("dotenv").config();
const db = require("../models");
const Game = db.games;
const Task = db.tasks;
const User = db.users;
const Player = db.players;
const Invite = db.invites;
const Location = db.locations;

const Op = db.Sequelize.Op;

const helpers = require("./calculateDistance");

const createLocation = async (locationString, gameId) => {
  console.log("Calling createLocation");

  try {
    const coordinates = await getCoordinates(locationString);
    console.log("Calling getCoordinates");

    if (coordinates) {
      console.log("Latitude:", coordinates.latitude);
      console.log("Longitude:", coordinates.longitude);
      const newLocation = await createNewLocation(
        gameId,
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

const createNewLocation = async (gameId, coordinates, locationString) => {
  console.log("Calling createNewLocation");
  console.log("gameId is:", gameId);

  const locationInfo = {
    gameId: gameId,
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

authenticateUserToken = async (req) => {
  const jwt = require("jsonwebtoken");
  const secretKey = process.env.SECRET;
  //FIND THE ID of the User
  try {
    // Ensure that the authorization header exists
    if (!req.headers.authorization) {
      console.log("Authorization header is missing");
      return null;
    }

    // Extract the token from the authorization header
    const jwtFromHeader = req.headers.authorization.replace("Bearer ", "");

    // Decode and verify the JWT
    const decoded = await jwt.verify(jwtFromHeader, secretKey);

    // Extract the user ID from the decoded JWT payload
    const userId = decoded.userID;
    console.log("User ID is " + userId);

    return userId;
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
};

// Create and Save a new Game
exports.create = async (req, res) => {
  try {
    console.log("A create game request has arrived");
    console.log("Location is " + req.body.location);

    // Validate request
    if (!req.body.location) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }
    console.log(req.headers);

    const jwt = require("jsonwebtoken");
    const secretKey = process.env.SECRET;
    //FIND THE ID of the User
    console.log("Auth token is " + req.headers.authorization);
    const jwtFromHeader = req.headers.authorization.replace("Bearer ", "");

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

    ////////////PLACE GEOCODING CALL BELOW////////////////////

    const apiKey = process.env.GEOCODER_API_KEY;

    const address = "482 Manning Avenue,Toronto,ON";

    const getGeocode = async (address, apiKey) => {
      console.log("getGeocode has been called.");
      const baseUrl = process.env.GEOCODER_URL;
      console.log(" Base Geocoder URL is: " + baseUrl);

      const queryParams = {
        key: apiKey,
        location: address, // Replace with your location
      };

      const queryString = new URLSearchParams(queryParams).toString();

      const url = `${baseUrl}?${queryString}`;
      console.log("Geocoder URL is: " + url);

      try {
        const headers = {
          "Content-Type": "application/json",
        };

        const requestOptions = {
          headers,
        };

        fetch(url, requestOptions)
          .then((res) => {
            if (res.ok) {
              console.log("res was ok");
              return res.json();
            } else throw new Error("Network response was not ok.");
          })
          .then((res) => {
            console.log("Results are...");
            console.log(res.results[0].locations[0].latLng);
          });
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };

    // getGeocode(address, apiKey);

    ////////////PLACE GEOCODING CALL ABOVE////////////////////

    // Create a Game
    const game = {
      location: req.body.location,
      date: req.body.date,
      time: req.body.time,
      position: req.body.position,
      sport: req.body.sport,
      gameLength: req.body.gameLength,
      calibre: req.body.calibre,
      gameType: req.body.gameType,
      gender: req.body.gender,
      teamName: req.body.teamName,
      additionalInfo: req.body.additionalInfo,
      isActive: true,
      userId: userId,
    };

    Object.keys(game).forEach((key) => {
      console.log(`${key}: ${game[key]}`);
    });

    // Save Game in the database
    const newGame = await Game.create(game);
    const newLocation = await createLocation(game.location, newGame.id);

    console.log("New location ID is:", newLocation.id);

    const response = {
      success: true, // Set the success property to true
      game: newGame,
      message: "Game Added",
    };
    res.status(200).send(response);
    console.log("Game Added");

    //Begin the process of finding a suitable player
    //Create a task for finding a player

    const task = {
      gameId: newGame.id,
      status: "pending",
    };
    Object.keys(task).forEach((key) => {
      console.log(`${key}: ${task[key]}`);
    });
    const newTask = await Task.create(task);
    // console.log("New Task Created: ", newTask); // Log the new task for debugging

    // If newTask is undefined or null, handle the error
    if (!newTask) {
      throw new Error("Failed to create a new task.");
    } else {
      console.log("Task Added");
    }
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      // Handle validation errors
      const validationErrors = err.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    } else {
      console.log(err);
      // res.status(500).json({
      //   success: false,
      //   message: "Internal server error",
      // });
    }
  }
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
exports.findAllActive = async (req, res) => {
  console.log("FindAll Active Games Request Received");

  const jwt = require("jsonwebtoken");
  const secretKey = process.env.SECRET;

  try {
    const jwtFromHeader = req.headers.authorization.replace("Bearer ", "");

    // Decode and verify the JWT
    const decoded = jwt.verify(jwtFromHeader, secretKey);
    const userId = decoded.userID;

    console.log("JWT verification succeeded. User ID is " + userId);

    //FIND ACTIVE GAMES BELONGING TO THE USER
    try {
      console.log("Finding active games for user " + userId + "...");
      const activeGames = await Game.findAll({
        where: { isActive: true, userId: userId },
      });
      let message = "";
      if (activeGames.length === 0) {
        message = "No active games found.";
      } else {
        message = "Active games found.";
      }
      console.log("Active games are " + activeGames);

      const result = activeGames
        .map((game) => {
          if (game) {
            return {
              game: game,
            };
          }
        })
        .filter((gameObj) => gameObj);

      const response = {
        success: true,
        availableGames: result,
        message: message,
      };
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    }
  } catch (err) {
    console.log("JWT verification failed");
    res.status(401).send({ message: "Unauthorized" });
  }
};

// Retrieve all Active Games from the database.
exports.findAllPending = async (req, res) => {
  console.log("FindAll Pending Games Request Received");

  try {
    const userId = await authenticateUserToken(req);

    //FIND ACTIVE GAMES BELONGING TO THE USER
    try {
      console.log("Finding active games for user " + userId + "...");
      const activeGames = await Game.findAll({
        where: { is_active: true, userId: userId, matchedPlayerId: null },
      });
      let message = "";
      if (activeGames.length === 0) {
        message = "No active games found.";
      } else {
        message = "Active games found.";
      }
      console.log("Active games are " + activeGames);

      const response = {
        success: true,
        activeGames: activeGames,
        message: message,
      };
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    }
  } catch (err) {
    console.log("JWT verification failed");
    res.status(401).send({ message: "Unauthorized" });
  }
};

// Find a single Game with an id
exports.findOne = async (req, res) => {
  const gameId = req.params.id;
  const jwt = require("jsonwebtoken");
  const secretKey = process.env.SECRET;

  const jwtFromHeader = req.headers.authorization.replace("Bearer ", "");

  // Decode and verify the JWT
  const decoded = jwt.verify(jwtFromHeader, secretKey);
  const userId = decoded.userID;

  try {
    const game = await Game.findByPk(gameId);
    if (!game) {
      message = "Game not found.";
    } else {
      message = "Game found.";
      console.log("Game is " + game.date);

      const response = {
        success: true,
        game: game,
        message: message,
      };
      res.status(200).send(response);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving game.",
    });
  }
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

exports.findAllGameInvites = async (req, res) => {
  console.log("findAllGameInvites called...");
  const userId = await authenticateUserToken(req);
  if (!userId) {
    console.log("ERROR");
  } else {
    const user = await User.findByPk(userId);
    const players = await user.getPlayers();

    const invitesPromises = players.map((player) => player.getInvites());
    const invitesArrays = await Promise.all(invitesPromises);

    const invites = [].concat(...invitesArrays);

    // Fetch all the games associated with the invites
    const gamesPromises = invites.map(async (invite) => {
      const game = await invite.getGame(); // Fetch the game
      if (game && !game.matchedPlayerId) {
        console.log(game.matchedPlayerId);
        return game;
      }
    });

    const games = await Promise.all(gamesPromises);

    const locationsPromises = games
      .filter((game) => !!game) // Filter out undefined games
      .map(async (game) => {
        const location = await game.getLocation(); // Fetch the location
        return location;
      });

    const locations = await Promise.all(locationsPromises);

    const result = games
      .filter((game) => !!game) // Filter out undefined games
      .map((game, index) => ({
        game: {
          id: game.id,
          date: game.date,
          time: game.time,
          sport: game.sport,
          location: game.location,
          matchedPlayerId: game.matchedPlayerId,
          position: game.position,
          calibre: game.calibre,
          gender: game.gender,
          gameType: game.gameType,
          gameLength: game.gameLength,
          geocoordinates: locations[index] || "", // Use the corresponding location
        },
      }));

    const response = {
      success: true,
      availableGames: result,
    };
    const lastElement = response.availableGames.length - 1;
    const longitude =
      response.availableGames[lastElement].game.geocoordinates.dataValues
        .longitude;

    console.log(longitude);
    res.status(200).send(response);
  }
};

// Find a single Game with an id
exports.joinGame = async (req, res) => {
  console.log("Join game request received");

  const jwt = require("jsonwebtoken");
  const secretKey = process.env.SECRET;

  const jwtFromHeader = req.headers.authorization.replace("Bearer ", "");

  // Decode and verify the JWT
  const decoded = jwt.verify(jwtFromHeader, secretKey);
  const userId = decoded.userID;
  console.log("User Id in joinGame request is: ", userId);

  const gameId = req.body.gameId;

  try {
    // Check if gameId is provided
    if (!gameId) {
      return res.status(400).send({ message: "Game ID is required." });
    }
    // Check if game with provided gameId exists
    const game = await Game.findByPk(gameId);
    const user = await User.findByPk(userId);

    if (!game) {
      return res.status(404).send({ message: "Game not found." });
    } else {
      console.log(game);
    }
    // Do something with the game, e.g., join the game
    const player = await Player.findOne({
      where: { isActive: true, userId: userId, sport: game.sport },
    });

    if (!player) {
      console.log("No Player Found");
    } else {
      const gameUpdates = { matchedPlayerId: player.id };
      const inviteUpdates = { accepted: true };

      const result = await Game.update(gameUpdates, {
        where: { id: gameId },
      });
      const invite = await Invite.update(inviteUpdates, {
        where: { playerId: player.id, gameId: gameId },
      });
      console.log(
        `Attaching Player with ID ${player.id} to Game with ID ${gameId}`
      );
      console.log(`Marking Invite with ID ${invite.id} as 'true'`);
      console.log(result);
    }

    // For now, just send a success response with the game object
    const response = {
      success: true,
      game: game,
      message: "Game found.",
    };
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving game.",
    });
  }
};

exports.findAllAcceptedPlayerInvites = async (req, res) => {
  console.log("findAllGameInvites called...");
  const userId = await authenticateUserToken(req);
  if (!userId) {
    console.log("ERROR");
  } else {
    const user = await User.findByPk(userId);
    const players = await user.getPlayers();

    const invitesPromises = players.map((player) => player.getInvites());
    const invitesArrays = await Promise.all(invitesPromises);

    const invites = [].concat(...invitesArrays);

    const acceptedInvites = invites.filter(
      (invite) => invite.accepted === true && invite.status === "active"
    );

    // Fetch all the games associated with the invites
    const gamesPromises = acceptedInvites.map(async (invite) => {
      const game = await invite.getGame(); // Fetch the game
      return game;
    });

    const games = await Promise.all(gamesPromises);

    const result = games
      .map((game) => {
        if (game) {
          return {
            game: game,
          };
        }
      })
      .filter((gameObj) => gameObj);

    const response = {
      success: true,
      availableGames: result,
    };
    res.status(200).send(response);
  }
};
