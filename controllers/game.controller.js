require("dotenv").config();
const { isValid, parseISO } = require("date-fns");
const db = require("../models");
const Game = db.games;
const Task = db.tasks;
const User = db.users;
const Player = db.players;
const Invite = db.invites;
const Location = db.locations;

const Op = db.Sequelize.Op;

const createLocation = async (locationString, gameId) => {
  console.log("Calling createLocation");
  console.log("with gameId, ", gameId);

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
    //FIND THE ID of the User
    console.log("Auth token is " + req.headers.authorization);
    const userId = req.user.userID;
    console.log("userId in game.create is", userId);

    // Decode and verify the JWT

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
      locationName: req.body.locationName,
      additionalInfo: req.body.additionalInfo,
      isActive: true,
      userId: userId,
    };

    // Log game properties
    Object.keys(game).forEach((key) => {
      console.log(`${key}: ${game[key]}`);
    });

    if (game?.date) {
      const preFormattedDate = game.date.trim();
      const parsedDate = parseISO(preFormattedDate);

      if (isValid(parsedDate)) {
        game.date = parsedDate.toISOString(); // Update game.date with ISO format
      } else {
        console.log("preFormattedDate is not Valid");
      }
    } else {
      console.error("Invalid date format:", game.date);
    }

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

  try {
    const userId = req.user.userID;

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
    const userId = req.user.userID;

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
  console.log("Game.findOne called with id", gameId);
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
exports.update = async (req, res) => {
  console.log("Games.Update request received.");
  console.log("Req.body is", req.body);

  try {
    console.log(req.body);
    const gameId = req.params.id;
    //if the value of  is blank, use the original value
    const {
      location,
      date,
      time,
      calibre,
      gender,
      position,
      gameType,
      gameLength,
      additionalInfo,
    } = req.body;

    const game = await Game.findByPk(gameId);
    if (!game) {
      console.log("Game not found with id" + gameId);
      return res.status(404).json({ error: "Game not found." });
    }
    //create an object to hold any changes
    const updates = {};
    if (typeof location !== "undefined" && location.trim() !== "") {
      updates.location = location;
    }
    if (date?.dateString?.trim()) {
      const parsedDate = parseISO(date.dateString);

      if (isValid(parsedDate)) {
        // Store in ISO format for consistency
        updates.date = parsedDate.toISOString(); // This ensures the date is in ISO format
        console.log("Updates.date is", updates.date);
      } else {
        console.error("Invalid date format:", date.dateString);
        // Optional: provide user feedback here
      }
    }
    if (typeof time !== "undefined" && time.trim() !== "") {
      updates.time = time;
    }
    if (typeof calibre !== "undefined" && calibre.trim() !== "") {
      updates.calibre = calibre;
    }
    if (typeof gender !== "undefined" && gender.trim() !== "") {
      updates.gender = gender;
    }
    if (typeof position !== "undefined" && position.trim() !== "") {
      updates.position = position;
    }
    if (typeof gameType !== "undefined" && gameType.trim() !== "") {
      updates.gameType = gameType;
    }
    if (typeof gameLength !== "undefined" && gameLength.trim() !== "") {
      updates.gameLength = gameLength;
    }
    if (typeof additionalInfo !== "undefined" && additionalInfo.trim() !== "") {
      updates.additionalInfo = additionalInfo;
    }

    console.log("Game Updates are", updates);
    if (Object.keys(updates).length > 0) {
      Game.update(updates, {
        where: { id: gameId },
      })
        .then((num) => {
          if (num == 1) {
            res.send({
              success: true,
              message: "Game was updated successfully.",
            });
          } else {
            console.log("Problem with game.update");
            res.send({
              message: `Cannot update game with id=${gameId}. Maybe game was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating game with id=" + gameId,
          });
        });
    } else {
      res.send({
        success: true,
        message: "No Changes to Game Were Made",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Delete a Game with the specified id in the request
exports.delete = async (req, res) => {
  console.log("game.delete request received with ID", req.params.id);
  const gameId = req.params.id;

  const game = await Game.findOne({ where: { id: gameId } });

  if (!game) {
    console.log(`Game with ID ${gameId} not found.`);
    return res.status(400).send({
      message: "Cannot Delete a Game with a Matched Player",
    });
  }

  console.log("Game is", game);

  if (game.matchedPlayerId != null) {
    console.log("Matched player id != null");
    return res.status(400).send({
      message: "Cannot Delete a Game with a Matched Player",
    });
  }

  if (game.matchedPlayerId == null) {
    console.log("Matched player id != null");
    Game.destroy({
      where: { id: gameId },
    })
      .then((num) => {
        if (num == 1) {
          return res.status(200).send({
            message: "gameDeleted",
          });
        } else {
          res.send({
            message: `Cannot delete Game with id=${gameId}. Maybe Game was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete Game with id=" + gameId,
        });
      });
  }
};

exports.findAllGameInvites = async (req, res) => {
  console.log("findAllGameInvites called for user with ID", req.user.userID);
  const userId = req.user.userID;
  const futureFlag = req.headers["futureflag"];
  const noCreations = req.headers["nocreations"];

  if (!userId) {
    console.log("ERROR");
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }

  try {
    const user = await User.findByPk(userId);
    if (user) {
      let playerLocation;
      const players = await user.getPlayers();
      if (players.length > 0) {
        const firstPlayer = players[0];
        playerLocation = await firstPlayer.getLocation();
      }

      const invitesPromises = players.map((player) => player.getInvites());
      const invitesArrays = await Promise.all(invitesPromises);
      const invites = [].concat(...invitesArrays);

      const gamesPromises = invites.map(async (invite) => {
        const game = await invite.getGame();
        if (game && !game.matchedPlayerId) {
          return game;
        }
      });
      const gamesResults = await Promise.allSettled(gamesPromises);
      let games = gamesResults
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      if (futureFlag) {
        const today = new Date().setHours(0, 0, 0, 0);
        games = games.filter((game) => {
          if (game) {
            const gameDate = new Date(game.date).setHours(0, 0, 0, 0);
            return gameDate >= today;
          } else {
            return false;
          }
        });
      }
      if (noCreations) {
        games = games.filter((game) => {
          if (game.userId != userId) {
            return game;
          } else {
            return false;
          }
        });
      }
      const locationsPromises = games.map(async (game) => {
        try {
          if (!game) {
            console.log("No game");
          } else {
            const itme = await Game.findByPk(game.id);

            const location = await itme.getLocation();
            if (!location) {
              console.log("No location associated with Game:", game.id);
            } else {
              return location;
            }
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          return null;
        }
      });
      const locationsResults = await Promise.allSettled(locationsPromises);
      const locations = locationsResults
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      const uniqueGames = new Set(); // Set to store unique game IDs
      const result = games
        .filter((game) => !!game)
        .reduce((acc, game, index) => {
          if (!uniqueGames.has(game.id)) {
            uniqueGames.add(game.id);
            acc.push({
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
                geocoordinates: locations[index] || null,
              },
            });
          }
          return acc;
        }, []);
      res.status(200).send({
        success: true,
        availableGames: result,
        playerLocation: playerLocation || null, // Include the location of the first player
      });
    }
  } catch (error) {
    console.error("Error fetching game invites:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

// Find a single Game with an id
exports.joinGame = async (req, res) => {
  console.log("Join game request received");

  const gameId = req.params.id;
  const userId = req.user.userID;
  console.log("gameId =", gameId);
  console.log("userId =", userId);

  try {
    // Check if gameId is provided
    if (!gameId) {
      return res.status(400).send({ message: "Game ID is required." });
    }

    // Check if game with provided gameId exists
    const game = await Game.findByPk(gameId);
    const user = await User.findByPk(userId);

    if (game.userId === userId) {
      return res
        .status(400)
        .send({ errorMessage: "You cannot join your own game" });
    }

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
      try {
        const invite = await Invite.update(inviteUpdates, {
          where: { playerId: player.id, gameId: gameId },
        });
        const acceptedInvite = await Invite.findOne({
          where: { playerId: player.id, gameId: gameId },
        });
        console.log(`Marking Invite with ID ${acceptedInvite.id} as 'true'`);
      } catch {
        ("Invite for player not found");
      }
      console.log(
        `Attaching Player with ID ${player.id} to Game with ID ${gameId}`
      );
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

exports.quitGame = async (req, res) => {
  console.log("Quit game request received");
  const gameId = req.body.gameId;
  const userId = req.user.userID;
  console.log("gameId =", gameId);
  console.log("userId =", userId);

  try {
    // Check if gameId is provided
    if (!gameId) {
      return res.status(400).send({ message: "Game ID is required." });
    }
    // Check if game with provided gameId exists
    const game = await Game.findByPk(gameId);

    if (!game) {
      return res.status(404).send({ message: "Game not found." });
    } else {
      console.log(game);
    }

    const player = await Player.findOne({
      where: { isActive: true, userId: userId, sport: game.sport },
    });

    if (!player) {
      console.log("No Player Found");
    } else {
      const gameUpdates = { matchedPlayerId: null };
      const inviteUpdates = { accepted: false };

      const result = await Game.update(gameUpdates, {
        where: { id: gameId },
      });
      const invite = await Invite.update(inviteUpdates, {
        where: { playerId: player.id, gameId: gameId },
      });
      console.log(
        `Removing Player with ID ${player.id} to Game with ID ${gameId}`
      );
      console.log(`Marking Invite with ID ${invite.id} as 'false'`);
      console.log(result);
    }

    // For now, just send a success response with the game object
    const response = {
      success: true,
      game: game,
      message: "Game Quit",
    };
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving game.",
    });
  }
};

// Returns all games where the user's player has joined/accepted an invite
exports.findAllAcceptedPlayerInvites = async (req, res) => {
  console.log("findAllAcceptedPlayerInvites called...");

  const userId = req.user?.userID;

  if (!userId) {
    console.log("ERROR: No user ID provided.");
    return res
      .status(400)
      .send({ success: false, message: "User ID is required" });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      console.log("ERROR: No user found.");
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    const players = await user.getPlayers();

    // Fetch invites for all players
    const invitesPromises = players.map((player) => player.getInvites());
    const invitesArrays = await Promise.all(invitesPromises);

    // Flatten the invites array
    const invites = invitesArrays.flat();

    // Filter accepted invites
    const acceptedInvites = invites.filter(
      (invite) => invite.accepted === true
    );

    // Fetch all the games associated with the accepted invites
    const gamesPromises = acceptedInvites.map((invite) => invite.getGame());
    const games = await Promise.all(gamesPromises);
    const today = new Date().setHours(0, 0, 0, 0); // Reset time to midnight for comparison

    // Filter games that are on or after today
    const result = games.filter((game) => {
      if (game) {
        const gameDate = new Date(game.date).setHours(0, 0, 0, 0);
        return gameDate >= today;
      } else {
        return false;
      }
    });

    console.log("Filtered Game Results:", result);

    const response = {
      success: true,
      availableGames: result,
    };
    return res.status(200).send(response);
  } catch (error) {
    console.error("Error occurred in findAllAcceptedPlayerInvites:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while fetching games.",
    });
  }
};
