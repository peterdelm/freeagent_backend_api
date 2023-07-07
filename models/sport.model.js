module.exports = (sequelize, Sequelize) => {
  const Sport = sequelize.define("sport", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sport: {
      type: Sequelize.STRING,
    },
    game_length: {
      type: Sequelize.STRING,
    },
    game_type: {
      type: Sequelize.STRING,
    },
    calibre: {
      type: Sequelize.DATE,
    },
    position: {
      type: Sequelize.STRING,
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

  return Sport;
};
