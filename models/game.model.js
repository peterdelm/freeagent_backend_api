module.exports = (sequelize, Sequelize) => {
  const Game = sequelize.define("game", {
    location: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
      validate: {
        isDate: {
          msg: "Please enter a valid date",
        },
      },
    },
    time: {
      type: Sequelize.TIME,
    },
    game_length: {
      type: Sequelize.INTEGER,
    },
    calibre: {
      type: Sequelize.STRING,
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
    is_active: {
      type: Sequelize.BOOLEAN,
    },
  });

  return Game;
};
