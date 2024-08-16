const db = require("../models");
const Game = db.games;
const Player = db.players;
const Location = db.locations;
const sequelize = db.sequelize;
const { Op } = require("sequelize");

// let criteria = {
//   range: range,
//   gender: gender,
//   position: position,
//   calibre: calibre,
//   sport: sport,
// };

//Returns an array of players which fit the criteria
const playerFindingLogic = async (task) => {
  try {
    //Assemble a list of suitable players
    console.log("Player Finding logic has been called");
    //Get the game associated with the task
    const game = await Game.findByPk(task.gameId);
    const gameLocation = await game.getLocation();

    const haversineDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (value) => (value * Math.PI) / 180;

      const R = 6371; // Radius of the Earth in kilometers
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

    const rangeFilter = (players) => {
      let playerList = [];

      players.forEach((player) => {
        const playerLocation = player.Location;
        const distance = haversineDistance(
          gameLocation.latitude,
          gameLocation.longitude,
          playerLocation.latitude,
          playerLocation.longitude
        );

        console.log(
          `Player ${player.id} is ${distance.toFixed(2)} km away from the game.`
        );
        if (distance.toFixed(2) <= player.travelRange) {
          playerList.push(player);
        }
      });
      return playerList;
    };

    const players = await Player.findAll({
      where: {
        isActive: true,
        sport: game.sport,
      },
      include: [
        {
          model: Location,
          as: "Location",
          required: true,
        },
      ],
    });

    //Criteria:
    //1. Gender == Gender
    //2. Sport == Sport
    //3. Position == Position
    //4. Calibre == Calibre
    //6. Range >= Distance from Player to Stadium

    //Also isActive == true

    //create a failure/retry case for when there is no suitable Player found

    let playerOptions;

    if (
      // Case 1: All values are 'any'
      game.gender === "Any" &&
      game.position === "Any" &&
      game.calibre === "Any"
    ) {
      console.log("Testing Case 1");
      console.log(
        "Gender: " + game.gender,
        "Position: " + game.position,
        "Calibre: " + game.calibre
      );

      const playersWithinRange = players;

      playerOptions = rangeFilter(players);

      if (playerOptions.length === 0) {
        console.log("No players found for current criteria");
      } else {
        playerOptions.forEach((player) => {
          console.log("Player address is ", player.location);
        });
        console.log("playerOptions are: ", playerOptions.length);
      }
    } else if (
      // Case 2: Gender and position are 'any', calibre is 'specific'
      game.gender === "Any" &&
      game.position === "Any" &&
      game.calibre !== "Any"
    ) {
      console.log("Testing Case 2");

      playerOptions = await Player.findAll({
        ...playerQueryArgs,
        where: {
          ...playerQueryArgs.where,
          calibre: game.calibre,
        },
      });
    } else if (
      // Case 3: Calibre and gender are 'any', position is 'specific'
      game.gender === "Any" &&
      game.position !== "Any" &&
      game.calibre === "Any"
    ) {
      console.log("Testing Case 3");

      playerOptions = await Player.findAll({
        where: {
          isActive: true,
          sport: game.sport,
          position: game.position,
        },
      });
    } else if (
      // Case 4: Position and Calibre are 'any', Gender is 'specific'
      game.gender !== "Any" &&
      game.position === "Any" &&
      game.calibre === "Any"
    ) {
      console.log("Testing Case 4");

      playerOptions = await Player.findAll({
        where: {
          isActive: true,
          sport: game.sport,
          gender: game.gender,
        },
      });
    } else if (
      // Case 5: Gender is 'any', position and calibre are 'specific'
      game.gender === "Any" &&
      game.position !== "Any" &&
      game.calibre !== "Any"
    ) {
      console.log("Testing Case 5");

      playerOptions = await Player.findAll({
        where: {
          isActive: true,
          sport: game.sport,
          position: game.position,
          calibre: game.calibre,
        },
      });
    } else if (
      // Case 6:
      game.gender !== "Any" &&
      game.position === "Any" &&
      game.calibre !== "Any"
    ) {
      console.log("Testing Case 6");

      playerOptions = await Player.findAll({
        where: {
          isActive: true,
          sport: game.sport,
          gender: game.gender,
          calibre: game.calibre,
        },
      });
    } else if (
      // Case 7:
      game.gender !== "Any" &&
      game.position !== "Any" &&
      game.calibre === "Any"
    ) {
      console.log("Testing Case 7");

      playerOptions = await Player.findAll({
        where: {
          isActive: true,
          sport: game.sport,
          gender: game.gender,
          position: game.position,
        },
      });
    } else if (
      // Case 8: All values are 'specific'
      game.gender != "Any" &&
      game.position != "Any" &&
      game.calibre != "Any"
    ) {
      console.log("Testing Case 8");
      playerOptions = await Player.findAll({
        where: {
          isActive: true,
          sport: game.sport,
          gender: game.gender,
          position: game.position,
          calibre: game.calibre,
        },
      });
    } else {
      console.log("No Player Found for Current Criteria");
    }

    playerOptions;
    return playerOptions;
  } catch (error) {
    console.error("Error occurred while finding players:", error);
    return [];
  }
};

module.exports = { playerFindingLogic };
