module.exports = (sequelize, Sequelize) => {
  const Game = sequelize.define("game", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    location: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATEONLY,
      validate: {
        isDate: {
          msg: "Please enter a valid date",
        },
      },
    },
    time: {
      type: Sequelize.TIME,
      isDate: {
        msg: "Please enter a valid time",
      },
    },
    game_length: {
      type: Sequelize.STRING,
    },
    calibre: {
      type: Sequelize.STRING,
    },
    game_type: {
      type: Sequelize.STRING,
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
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
  });

  return Game;
};
