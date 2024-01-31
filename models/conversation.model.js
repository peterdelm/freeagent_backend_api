"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.belongsToMany(models.Participant, {
        through: Participant,
        foreignKey: "conversationId",
        otherKey: "userId",
      });
      Conversation.hasMany(models.Message, {
        foreignKey: "conversationId",
      });
    }
  }
  Conversation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "Conversation",
      timestamps: true, // Automatically adds createdAt and updatedAt columns
      updatedAt: "updatedAt", // Customize the name of the updatedAt column if needed
    }
  );

  return Conversation;
};
