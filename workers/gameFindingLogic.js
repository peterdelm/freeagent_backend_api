const db = require("../models");
const Game = db.games;
const Player = db.players;
const Location = db.locations;
const { Op } = require("sequelize");

const gameFindingLogic = async (playerId) => {
  try {
    console.log("Game Finding logic has been called");

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

    const games = await Game.findAll({
      where: {
        sport: newPlayer.sport,
        position: {
          [Op.in]: ["Any", newPlayer.position],
        },
        calibre: {
          [Op.in]: ["Any", newPlayer.calibre],
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
