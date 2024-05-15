// tests/searchPlayers.test.js
const { playerFindingLogic } = require("../workers/playerFindingLogic.js");

const db = require("../models");

//1. Create a player who is in Toronto

describe("playerFindingLogic", () => {
  it("should return players who are close to the game", async () => {
    // Mock a task object with gameId and other necessary properties
    const task = { id: 1, gameId: 1 /* Add other properties as needed */ };

    // Mock the Game model method findByPk to return a game object
    db.games.findByPk = jest
      .fn()
      .mockResolvedValue({ sport: "soccer", gender: "Male" });

    // Mock the game object's method getLocation to return a gameLocation object
    const gameLocation = {
      latitude: 123,
      longitude: 456 /* Add other properties as needed */,
    };
    db.games.prototype.getLocation = jest.fn().mockResolvedValue(gameLocation);

    // Mock the Player model method findAll to return players within range
    const playersWithinRange = [
      /* Mock player objects within range */
    ];
    db.players.findAll = jest.fn().mockResolvedValue(playersWithinRange);

    const players = await playerFindingLogic(task);

    // Add assertions to verify the correct players are returned based on your criteria
    expect(players).toEqual(/* Expected players array */);
  });

  // Add more test cases to cover other scenarios
});
