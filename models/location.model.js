"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate = (models) => {
      Location.belongsTo(models.Game, { foreignKey: "gameId" });
      Location.belongsTo(models.Player, { foreignKey: "playerId" });
    };
  }
  Location.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      gameId: {
        type: DataTypes.UUID,
        references: {
          model: "games",
          key: "id",
        },
        allowNull: true,
      },
      playerId: {
        type: DataTypes.UUID,
        references: {
          model: "players",
          key: "id",
        },
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Location",
      timestamps: true, // Automatically adds createdAt and updatedAt columns
      updatedAt: "updatedAt", // Customize the name of the updatedAt column if needed
    }
  );
  return Location;
};
