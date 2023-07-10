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
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    game_type: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    calibre: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    position: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    gender: {
      type: Sequelize.ARRAY(Sequelize.STRING),
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
