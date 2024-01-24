const { v4: uuidv4 } = require("uuid");
const { Participant } = require("./participant.model");

module.exports = (sequelize, Sequelize) => {
  const Conversation = sequelize.define("conversation", {
    id: {
      type: Sequelize.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
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

  Conversation.associate = (models) => {
    Conversation.belongsToMany(models.User, {
      through: Participant,
      foreignKey: "conversationId",
      otherKey: "userId",
    });

    Conversation.hasMany(models.Message, { foreignKey: "conversationId" });
  };

  return Conversation;
};
