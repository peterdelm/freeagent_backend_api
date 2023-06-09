module.exports = (sequelize, Sequelize) => {
  const Game = sequelize.define("game", {
    location: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },
    time: {
      type: Sequelize.TIME,
    },
    game_length: {
      type: Sequelize.INTEGER,
    },
    game_type: {
      type: Sequelize.INTEGER,
    },
    gender: {
      type: Sequelize.STRING,
    },
    team_name: {
      type: Sequelize.STRING,
    },
    additional_info: {
      type: Sequelize.TEXT,
    },
  });

  return Game;
};
