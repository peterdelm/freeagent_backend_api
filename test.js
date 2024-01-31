// const userId = "8e2d5af2-3883-4649-a41c-e67b7f59deea";
const db = require("./models");
const User = db.users;
const Player = db.players;
const Game = db.games;
const Conversation = db.conversations;

const run_test = async () => {
  // Create a user
  const userData = {
    firstName: "Peter",
    lastName: "Del Mastro",
    email: "mac@email.com",
    address: "44 Manning Avenue",
    birthdate: "2012-11-11",
    password: "BatmanRules!",
    isActive: true,
  };
  const user = await User.create(userData);

  const playerData = {
    calibre: "AA",
    gender: "Any",
    location: "Home",
    travelRange: "5",
    sport: "Soccer",
    bio: "Im a unit",
    position: "Forward",
    userId: user.id,
    isActive: true,
  };

  const player = await Player.create(playerData);
  const playerWithUser = await Player.findByPk(player.id, {
    include: "User",
  });

  console.log(
    "Test game is attached to user: " + playerWithUser.User.firstName
  );
  const gameData = {
    additionalInfo: "I am a test game",
    calibre: "Any",
    date: "2021-12-12",
    gameLength: "120",
    gameType: "5v5 (Ice)",
    gender: "Any",
    isActive: true,
    location: "Seahill, 123 West Coast Cres, Singapore 126779, Singapore",
    position: "Any",
    sport: "Soccer",
    teamName: "The Testers",
    time: "09:00",
    userId: user.id,
  };

  const game = await Game.create(gameData);

  const gameWithUser = await Game.findByPk(game.id, {
    include: "User",
  });

  console.log("Test game is attached to user: " + gameWithUser.User.firstName);

  const conversationData = {};

  const conversation = await Conversation.create(conversationData);
  console.log(conversation);
};

run_test();
