"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    static associate(models) {
      Participant.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        allowNull: false,
        onDelete: "CASCADE",
      });
      Participant.belongsTo(models.Conversation, {
        foreignKey: "conversationId",
        as: "conversation",
        allowNull: false,
        onDelete: "CASCADE",
      });
    }
  }
  Participant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      conversationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Participant",
      timestamps: true, // Automatically adds createdAt and updatedAt columns
      updatedAt: "updatedAt", // Customize the name of the updatedAt column if needed
    }
  );

  return Participant;
};
