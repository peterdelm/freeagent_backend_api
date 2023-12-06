const { v4: uuidv4 } = require("uuid");
const { Invites } = require("../models/invite.model");

module.exports = (sequelize, Sequelize) => {
  const Player = sequelize.define("player", {
    id: {
      type: Sequelize.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Calibre cannot be empty.",
        },
      },
    },
    birthdate: {
      type: Sequelize.DATE,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    years_played: {
      type: Sequelize.INTEGER,
    },
    calibre: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Calibre cannot be empty.",
        },
      },
    },
    game_length: {
      type: Sequelize.INTEGER,
    },
    travelRange: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Travel Range cannot be empty.",
        },
      },
    },
    bio: {
      type: Sequelize.TEXT,
    },
    sport: {
      type: Sequelize.STRING,
    },
    position: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
    },
    userId: {
      type: Sequelize.UUID,
      references: {
        model: "users", // This should match the table name of the User model
        key: "id", // This should match the primary key of the User model
      },
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
  });

  Player.associate = (models) => {
    Player.belongsTo(models.User, { foreignKey: "userId" });
    Player.hasMany(Invites, { foreignKey: "playerId" });
  };
  return Player;
};
