"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Game.belongsTo(models.User, {
        foreignKey: "gameId",
        as: "game",
        allowNull: false,
        onDelete: "CASCADE",
      });

      Game.hasMany(models.Invites, {
        foreignKey: "gameId",
        as: "Invites",
      });

      Game.hasOne(models.Location, {
        foreignKey: "gameId",
        as: "location",
        onDelete: "CASCADE",
      });
    }
  }
  Game.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "Users", // This should match the table name of the User model
          key: "id", // This should match the primary key of the User model
        },
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        validate: {
          isDate: {
            msg: "Please enter a valid date",
          },
        },
      },
      time: {
        type: DataTypes.TIME,
        validate: {
          is: {
            args: /^([01]\d|2[0-3]):([0-5]\d)$/,
            msg: "Please enter a valid time",
          },
        },
      },
      sport: DataTypes.STRING,
      gameLength: DataTypes.STRING,
      calibre: DataTypes.STRING,
      gameType: DataTypes.STRING,
      gender: DataTypes.STRING,
      position: DataTypes.STRING,
      location: DataTypes.STRING,
      teamName: DataTypes.STRING,
      matchedPlayerId: DataTypes.UUID,
      isActive: DataTypes.BOOLEAN,
      additionalInfo: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Game",
      timestamps: true, // Automatically adds createdAt and updatedAt columns
      updatedAt: "updatedAt", // Customize the name of the updatedAt column if needed
    }
  );
  return Game;
};
