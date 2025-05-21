const db = require("../models");
const Task = db.tasks;
const Game = db.games;
const Invite = db.invites;

const { sendPushNotification } = require("../services/firebaseService.js");

async function processTask(task) {
  try {
    
    // Check for games that: have ended within the last 24 hours
    //                       the rating has not been applied
 // get all games where review hasn't been sent
    const games = await Game.findAll({
        where: {
        reviewPrompted: false,
        }
    });

  } catch (error) {
    await task.update({ status: "failed", error: error.message });
    console.error("Error occurred while finding players:", error);
  }
}

async function startPushToReviewPlayerWorker() {
  console.log("Starting startPushToReviewPLayerWorkers...");
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

module.exports = { startPushToReviewPlayerWorker };
