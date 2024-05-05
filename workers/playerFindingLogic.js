const db = require("../models");
const Game = db.games;
const Player = db.players;
// const Sequelize = require("sequelize");
const { Op } = require("sequelize");
// let criteria = {
//   range: range,
//   gender: gender,
//   position: position,
//   calibre: calibre,
//   sport: sport,
// };

// // Assuming Player and Game are your Sequelize models
// const playersWithinRange = await Player.findAll({
//   where: {
//     latitude: {
//       [Op.between]: [
//         gameLatitude - maxTravelRange,
//         gameLatitude + maxTravelRange,
//       ],
//     },
//     longitude: {
//       [Op.between]: [
//         gameLongitude - maxTravelRange,
//         gameLongitude + maxTravelRange,
//       ],
//     },
//   },
// });

const rangeFilter = () => {};

//Returns an array of players which fit the criteria
const playerFindingLogic = async (task) => {
  try {
    //Assemble a list of suitable players
    console.log("Processing Task with ID " + task.id);
    //Get the game associated with the task
    const game = await Game.findByPk(task.gameId);
    const gameLocation = await game.getLocation();
    console.log("gameLocation is: ", gameLocation);

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

      playerOptions = await Player.findAll({
        where: {
          isActive: true,
          sport: game.sport,
        },
      });

      if (playerOptions.length === 0) {
        console.log("No players found for current criteria");
      } else {
        console.log("playerOptions are: ", playerOptions);
      }
    } else if (
      // Case 2: Gender and position are 'any', calibre is 'specific'
      game.gender === "Any" &&
      game.position === "Any" &&
      game.calibre !== "Any"
    ) {
      console.log("Testing Case 2");

      playerOptions = await Player.findAll({
        where: {
          isActive: true,
          sport: game.sport,
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

    return playerOptions;
  } catch (error) {
    console.error("Error occurred while finding players:", error);
    return [];
  }
};

module.exports = { playerFindingLogic };
