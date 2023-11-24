const db = require("../models");
const Task = db.tasks;
const Game = db.games;
const Player = db.players;

async function processTask(task) {
  try {
    //Assemble a list of suitable players
    console.log("Processing Task...");
    //Get the game associated with the task
    const game = await Game.findByPk(task.gameId);

    //Criteria:
    //1. Gender == Gender
    //2. Sport == Sport
    //3. Position == Position
    //4. Calibre == Calibre
    //5. is_active == true
    //6. Range >= Distance from Player to Stadium

    let playerOptions;

    if (
      // Case 1: All values are 'any'
      game.gender === "any" &&
      game.position === "any" &&
      game.calibre === "any"
    ) {
      console.log("Testing Case 1");

      playerOptions = await Player.findAll({
        where: { is_active: true, sportId: game.sportId },
      });
    } else if (
      // Case 2: Gender and position are 'any', calibre is 'specific'
      game.gender === "any" &&
      game.position === "any" &&
      game.calibre !== "any"
    ) {
      console.log("Testing Case 2");

      playerOptions = await Player.findAll({
        where: {
          is_active: true,
          sportId: game.sportId,
          calibre: game.calibre,
        },
      });
    } else if (
      // Case 3: Calibre and gender are 'any', position is 'specific'
      game.gender === "any" &&
      game.position !== "any" &&
      game.calibre === "any"
    ) {
      console.log("Testing Case 3");

      playerOptions = await Player.findAll({
        where: {
          is_active: true,
          sportId: game.sportId,
          position: game.position,
        },
      });
    } else if (
      // Case 4: Position and Calibre are 'any', Gender is 'specific'
      game.gender !== "any" &&
      game.position === "any" &&
      game.calibre === "any"
    ) {
      console.log("Testing Case 4");

      playerOptions = await Player.findAll({
        where: {
          is_active: true,
          sportId: game.sportId,
          gender: game.gender,
        },
      });
    } else if (
      // Case 5: Gender is 'any', position and calibre are 'specific'
      game.gender === "any" &&
      game.position !== "any" &&
      game.calibre !== "any"
    ) {
      console.log("Testing Case 5");

      playerOptions = await Player.findAll({
        where: {
          is_active: true,
          sportId: game.sportId,
          position: game.position,
          calibre: game.calibre,
        },
      });
    } else if (
      // Case 6:
      game.gender !== "any" &&
      game.position === "any" &&
      game.calibre !== "any"
    ) {
      console.log("Testing Case 6");

      playerOptions = await Player.findAll({
        where: {
          is_active: true,
          sportId: game.sportId,
          gender: game.gender,
          calibre: game.calibre,
        },
      });
    } else if (
      // Case 7:
      game.gender !== "any" &&
      game.position !== "any" &&
      game.calibre === "any"
    ) {
      console.log("Testing Case 7");

      playerOptions = await Player.findAll({
        where: {
          is_active: true,
          sportId: game.sportId,
          gender: game.gender,
          position: game.position,
        },
      });
    } else if (
      // Case 8: All values are 'specific'
      game.gender !== "any" &&
      game.position !== "any" &&
      game.calibre !== "any"
    ) {
      console.log("Testing Case 8");
      playerOptions = await Player.findAll({
        where: {
          is_active: true,
          sportId: game.sportId,
          gender: game.gender,
          position: game.position,
          calibre: game.calibre,
        },
      });
    }

    console.log("Player Found with ID: " + playerOptions[0].id);

    //Send the request to the suitable players
    //Await the response...
    //Upon response, kill the pending game
    //Notify the manager
    //Mark gameslot as filled
    // Your task processing logic here
    // For example, querying the database, performing calculations, or interacting with other services.

    // Update the task's status to indicate successful completion.
    await task.update({ status: "completed" });
  } catch (error) {
    // Handle errors and update the task's status to indicate failure.
    await task.update({ status: "failed", error: error.message });
  }
}

async function startWorker() {
  console.log("Starting Workers...");
  while (true) {
    const task = await Task.findOne({
      where: { status: "pending" },
    });

    if (task) {
      // Lock the task to prevent other workers from processing it.
      await task.update({ status: "in-progress" });
      // Process the task.
      await processTask(task);
    } else {
      // If no tasks are available, you can add a delay or implement polling logic.
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

startWorker();
