"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Invite extends Model {
    static associate = (models) => {
      Invite.belongsTo(models.Game, { foreignKey: "gameId" });
      Invite.belongsTo(models.Player, { foreignKey: "playerId" });
    };
  }
  Invite.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      playerId: {
        type: DataTypes.UUID,
        references: {
          model: "players", // This should match the table name of the User model
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
      status: {
        type: DataTypes.STRING,
        defaultValue: "active",
      },
      accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Invite",
      timestamps: true, // Automatically adds createdAt and updatedAt columns
      updatedAt: "updatedAt", // Customize the name of the updatedAt column if needed
    }
  );

  return Invite;
};
