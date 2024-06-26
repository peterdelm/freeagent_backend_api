const db = require("../models");
const Task = db.tasks;
const Game = db.games;
const Player = db.players;
const Invite = db.invites;

async function processTask(task) {
  try {
    //Assemble a list of suitable players
    console.log("Processing Task with ID " + task.id);
    //Get the game associated with the task
    const game = await Game.findByPk(task.gameId);

    //Criteria:
    //1. Gender == Gender
    //2. Sport == Sport
    //3. Position == Position
    //4. Calibre == Calibre
    //5. isActive == true
    //6. Range >= Distance from Player to Stadium

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
        where: { isActive: true, sport: game.sport },
      });

      if (playerOptions.length === 0) {
        console.log("No players found for current criteria");
      } else {
        console.log("playerOptions are: ");
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

    console.log("Player Found with ID: " + playerOptions[0].id);

    for (const player of playerOptions) {
      inviteParams = {
        playerId: player.id,
        gameId: game.id,
      };

      const invite = await Invite.create(inviteParams);
      console.log("Player ID: " + player.id);
      console.log("Invite ID: " + invite.id);
    }
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
    console.error("Error occurred while finding players:", error);
  }
}

async function startWorker() {
  console.log("Starting Workers...");
  let running = true;

  process.on("SIGINT", async () => {
    console.log("Shutting down worker...");
    running = false;

    // Wait for any ongoing tasks to complete gracefully
    // For example, you could wait for the current task to finish processing
    // before allowing the shutdown to complete
    // This is just an example and you may need to adjust it based on your actual implementation
    // if (currentTask) {
    //   await currentTask;
    // }

    process.exit(0); // Exit the process
  });

  while (running) {
    try {
      const task = await Task.findOne({
        where: { status: "pending" },
      });

      if (task) {
        console.log("Task with status 'pending' found ");
        // Lock the task to prevent other workers from processing it.
        await task.update({ status: "in-progress" });
        // Process the task.
        await processTask(task);
      } else {
        // If no tasks are available, you can add a delay or implement polling logic.
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error occurred:", error.message);
    }
  }
}

module.exports = { startWorker };
