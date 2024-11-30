"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Player.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        allowNull: true,
        onDelete: "CASCADE",
      });

      Player.hasOne(models.Location, {
        foreignKey: "playerId",
        as: "location",
        allowNull: true,
        onDelete: "CASCADE",
      });
    }
  }
  Player.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      birthdate: DataTypes.DATE,
      gender: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, allowNull: false },
      yearsPlayed: DataTypes.INTEGER,
      gameLength: DataTypes.INTEGER,
      bio: DataTypes.TEXT,
      sport: DataTypes.STRING,
      position: DataTypes.STRING,
      travelRange: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Travel Range cannot be empty.",
          },
        },
      },
      calibre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Calibre cannot be empty.",
          },
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Location cannot be empty.",
          },
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Player",
      timestamps: true, // Automatically adds createdAt and updatedAt columns
      updatedAt: "updatedAt", // Customize the name of the updatedAt column if needed
    }
  );
  return Player;
};
