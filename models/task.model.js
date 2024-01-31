const { v4: uuidv4 } = require("uuid");
const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Task = sequelize.define("task", {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    taskType: {
      type: DataTypes.STRING,
    },
    taskInfo: {
      type: DataTypes.JSON,
    },
    status: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "users", // This should match the table name of the User model
        key: "id", // This should match the primary key of the User model
      },
      allowNull: false,
    },
    gameId: {
      type: DataTypes.UUID,
      references: {
        model: "games", // This should match the table name of the User model
        key: "id", // This should match the primary key of the User model
      },
      allowNull: false,
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

  return Task;
};
