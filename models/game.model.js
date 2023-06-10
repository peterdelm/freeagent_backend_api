module.exports = (sequelize, Sequelize) => {
  const Game = sequelize.define("game", {
    location: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
      validate: { isDate: true },
    },
    time: {
      type: Sequelize.TIME,
      validate: {
        isDate: {
          msg: "Please enter a valid date",
        },
      },
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
