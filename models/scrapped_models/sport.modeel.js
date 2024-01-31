const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Sport = sequelize.define("sport", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sport: {
      type: DataTypes.STRING,
    },
    game_length: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    game_type: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    calibre: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    position: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    gender: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
  });
  return Sport;
};
