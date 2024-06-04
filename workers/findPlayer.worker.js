const db = require("../models");
const Task = db.tasks;
const Game = db.games;
const Invite = db.invites;

const { sendPushNotification } = require("../services/firebaseService.js");
const { playerFindingLogic } = require("./playerFindingLogic"); // Import the worker module

async function processTask(task) {
  try {
    //Assemble a list of suitable players
    console.log("Processing Task with ID " + task.id);
    //Get the game associated with the task
    const game = await Game.findByPk(task.gameId);

    const playerOptions = await playerFindingLogic(task, game);

    let userPushTokens = [];

    for (const player of playerOptions) {
      inviteParams = {
        playerId: player.id,
        gameId: game.id,
      };

      const invite = await Invite.create(inviteParams);
      const user = await player.getUser();
      console.log("Player ID: " + player.id);
      console.log("Invite ID: " + invite.id);
      console.log("User pushToken is: " + user.pushToken);
      // Collect the push tokens
      if (user.pushToken) {
        userPushTokens.push(user.pushToken);
      }
    }
    //Send the request to the suitable players
    const response = sendPushNotification(userPushTokens);
    console.log("Expo Firebase response is", response);
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
