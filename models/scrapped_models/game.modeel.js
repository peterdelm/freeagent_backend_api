const { v4: uuidv4 } = require("uuid");
const { Invites } = require("./invite.model");
const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Game = sequelize.define("game", {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "users", // This should match the table name of the User model
        key: "id", // This should match the primary key of the User model
      },
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
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
    sport: {
      type: DataTypes.STRING,
    },
    game_length: {
      type: DataTypes.STRING,
    },
    calibre: {
      type: DataTypes.STRING,
    },
    game_type: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },
    team_name: {
      type: DataTypes.STRING,
    },
    additional_info: {
      type: DataTypes.TEXT,
    },
    matchedPlayerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
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

  Game.associate = (models) => {
    Game.belongsTo(models.User, { foreignKey: "userId" });
    Game.hasMany(models.Invites, { foreignKey: "gameId" });
  };

  return Game;
};
