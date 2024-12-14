const db = require("../models");
const Game = db.games;
const Player = db.players;
const Location = db.locations;
const { Op } = require("sequelize");

const gameFindingLogic = async (playerId) => {
  try {
    console.log("Game Finding logic has been called");
    console.log(playerId);

    const newPlayer = await Player.findByPk(playerId);
    if (!newPlayer) {
      console.log("Player not found!");
      return [];
    }

    const playerLocation = await newPlayer.getLocation();
    if (!playerLocation) {
      console.log("Player's location not found!");
      return [];
    }

    let calibreFilter = [];

    // Predefined order of calibres for different sports
    const hockeyHierarchy = [
      "E (little/ no experience)",
      "D (House League experience)",
      "C (Select, Rep / All Star, A experience)",
      "B (Jr B/C, Varsity, AA/AAA experience)",
      "A (Semi Pro / Major Jr experience)",
    ];

    const soccerHierarchy = ["Recreational", "Intermediate", "Advanced"];
    const volleyballHierarchy = ["Recreational", "Intermediate", "Advanced"];
    const frisbeeHierarchy = ["Recreational", "Intermediate", "Advanced"];
    const basketballHierarchy = ["Recreational", "Competitive"];

    // Function to assign the correct hierarchy based on the sport
    const assignHierarchy = () => {
      if (newPlayer.sport === "Hockey") {
        return hockeyHierarchy;
      } else if (newPlayer.sport === "Soccer") {
        return soccerHierarchy;
      } else if (newPlayer.sport === "Volleyball") {
        return volleyballHierarchy;
      } else if (newPlayer.sport === "Ultimate Frisbee") {
        return frisbeeHierarchy;
      } else if (newPlayer.sport === "Basketball") {
        return basketballHierarchy;
      } else {
        return [];
      }
    };

    const calibreHierarchy = assignHierarchy();

    console.log("Heirarchy is", calibreHierarchy);
    // Find the index of the game calibre in the hierarchy
    const calibreIndex = calibreHierarchy.indexOf(newPlayer.calibre);

    if (calibreIndex !== -1) {
      // Slice the array to include the calibres from the current level and above
      calibreFilter = calibreHierarchy.slice(0, calibreIndex + 1);
    } else {
      // Optionally handle the case if no matching calibre is found
      calibreFilter = [];
    }

    let excludedPositions = [];
    let includedPositions = [];

    if (newPlayer.position === "Any non-goalie") {
      excludedPositions.push("Goalie");
      includedPositions.push("Forward", "Defence");
    }

    console.log("CalibreFilter is", calibreFilter);
    console.log("excludedPositions are", excludedPositions);
    console.log("includedPositions are", includedPositions);

    const games = await Game.findAll({
      where: {
        sport: newPlayer.sport,
        position: {
          [Op.notIn]: excludedPositions,
          [Op.in]: ["Any", newPlayer.position, ...includedPositions],
        },
        calibre: {
          [Op.in]: ["Any", ...calibreFilter],
        },
        gender: {
          [Op.in]: ["Any", newPlayer.gender],
        },
        date: {
          [Op.gte]: new Date(),
        },
      },
      include: [
        {
          model: Location,
          as: "Location",
        },
      ],
    });

    if (games.length === 0) {
      console.log("No games found matching the criteria.");
      return [];
    }

    const haversineDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (value) => (value * Math.PI) / 180;

      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // Distance in kilometers
    };

    const rangeFilter = (games) => {
      let gameList = [];

      games.forEach((game) => {
        const gameLocation = game.Location;
        if (!gameLocation) {
          console.log(`Game ${game.id} has no location`);
          return;
        }

        const distance = haversineDistance(
          gameLocation.latitude,
          gameLocation.longitude,
          playerLocation.latitude,
          playerLocation.longitude
        );

        if (distance <= newPlayer.travelRange) {
          gameList.push(game);
        }
      });

      return gameList;
    };

    const gameList = rangeFilter(games);
    console.log(`Found ${gameList.length} suitable games.`);

    return gameList; // Return filtered list of games within range
  } catch (error) {
    console.error("Error occurred while finding games:", error);
    return []; // Return an empty array in case of error
  }
};

module.exports = { gameFindingLogic };
