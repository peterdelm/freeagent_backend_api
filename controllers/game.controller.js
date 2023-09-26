require("dotenv").config();
const db = require("../models");
const Game = db.games;
const Player = db.players;
const Op = db.Sequelize.Op;

const helpers = require("./calculateDistance");

// Create and Save a new Game
exports.create = async (req, res) => {
  try {
    console.log("A create game request has arrived");
    console.log("Location is " + req.headers);

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

    getGeocode(address, apiKey);

    ////////////PLACE GEOCODING CALL ABOVE////////////////////

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
      userId: userId,
    };

    // Save Game in the database
    const newGame = await Game.create(game);

    const response = {
      success: true, // Set the success property to true
      game: newGame,
      message: "Game Added",
    };
    res.status(200).send(response);
    console.log("Game Added");

    // err.errors.map((e) => console.log(e.message)); // The name must contain between 2 and 100 characters.
  } catch (err) {
    console.log(
      "There was a problem in game creation, line 80. Error is " + err
    );

    console.log("Problem with request");
    console.log("err.name", err.name);
    console.log("err.message", err.message);
    console.log("err.errors", err.errors);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Game.",
    });
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
        where: { is_active: true, userId: userId },
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
exports.findOne = (req, res) => {
  console.log("findOne game request received");
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

//Find a player who meets the criteria
exports.findTheRightPlayer = (req, res) => {
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

  console.log("Request for players received");

  const potential_players = Player.findAll({
    where: { gender: gender, personal_calibre: calibre },
    //where GAME_LOCATION to ADDRESS <= TRAVEL_RANGE (call this distanceBetween)
  });

  potential_players
    .then((data) => {
      res.send(data[0]); //sends the first player in the array
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Games.",
      });
    });
  //create game
  //find player where: calibre, gender, gametype, sport
};
