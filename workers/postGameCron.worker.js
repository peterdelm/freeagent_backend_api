const { Op } = require("sequelize");
const db = require("../models");
const cron = require("node-cron");
const Task = db.tasks;
const Game = db.games;

function getGameEndDateTime(game) {
  const gameDate = new Date(game.date);
  const [hour, minute] = game.time.split(":").map(Number);
  gameDate.setHours(hour, minute, 0, 0);

  const duration = parseInt(game.gameLength || "60", 10);
  gameDate.setMinutes(gameDate.getMinutes() + duration);

  return gameDate;
}

async function createPostGameTasks() {
  console.log("[CRON] Scanning for completed games without tasks...");
  const now = new Date();

  // Only get games in the past day for performance
  const recentGames = await Game.findAll({
    where: {
      date: {
        [Op.lte]: new Date(), // game started before now
      },
    },
  });

  for (const game of recentGames) {
    const endTime = getGameEndDateTime(game);

    if (endTime < now) {
      const existingTask = await Task.findOne({
        where: {
          gameId: game.id,
          taskType: "post_game_notify",
        },
      });

      if (!existingTask) {
        console.log(`[CRON] Creating post-game task for game ${game.id}`);
        await Task.create({
          gameId: game.id,
          taskType: "post_game_notify",
          status: "pending",
        });
      }
    }
  }

  console.log("[CRON] Post-game task scan complete.");
}

// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    await createPostGameTasks();
  } catch (error) {
    console.error("[CRON] Error running post-game cron:", error);
  }
});
