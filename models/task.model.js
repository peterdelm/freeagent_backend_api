"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Task.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      taskType: DataTypes.STRING,
      taskInfo: DataTypes.STRING,
      status: DataTypes.STRING,
      gameId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Task",
      timestamps: true, // Automatically adds createdAt and updatedAt columns
      updatedAt: "updatedAt", // Customize the name of the updatedAt column if needed
    }
  );
  return Task;
};
