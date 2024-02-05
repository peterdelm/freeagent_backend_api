"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Sport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Sport.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sport: DataTypes.STRING,
      gameLength: DataTypes.ARRAY(DataTypes.STRING),
      gameType: DataTypes.ARRAY(DataTypes.STRING),
      calibre: DataTypes.ARRAY(DataTypes.STRING),
      position: DataTypes.ARRAY(DataTypes.STRING),
      gender: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: "Sport",
      timestamps: true, // Automatically adds createdAt and updatedAt columns
      updatedAt: "updatedAt", // Customize the name of the updatedAt column if needed
    }
  );
  return Sport;
};
