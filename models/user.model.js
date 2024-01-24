const { v4: uuidv4 } = require("uuid");
const { Player } = require("../models/player.model");
const { Participant } = require("../models/participant.model");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
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
    email: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    birthdate: {
      type: Sequelize.DATEONLY,
    },
    password: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
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

  User.associate = (models) => {
    User.belongsToMany(models.Conversation, {
      through: Participant,
      foreignKey: "userId",
      otherKey: "conversationId",
    });

    User.hasMany(Player, { foreignKey: "userId" });
    User.hasMany(Message, { foreignKey: "senderId" });
  };

  return User;
};
