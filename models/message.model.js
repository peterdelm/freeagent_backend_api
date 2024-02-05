"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.user, {
        foreignKey: "userId",
        as: "user",
        allowNull: false,
      });
      Message.belongsTo(models.Conversation, {
        foreignKey: "conversationId",
        as: "conversation",
        allowNull: false,
      });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      senderId: {
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
  return Message;
};
