module.exports = (sequelize, Sequelize) => {
  const Goalie = sequelize.define("goalie", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    birthdate: {
      type: Sequelize.DATE,
    },
    gender: {
      type: Sequelize.STRING,
    },
    years_played: {
      type: Sequelize.INTEGER,
    },
    personal_calibre: {
      type: Sequelize.STRING,
    },
    game_length: {
      type: Sequelize.INTEGER,
    },
    travel_range: {
      type: Sequelize.INTEGER,
    },
    bio: {
      type: Sequelize.TEXT,
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

  return Goalie;
};
