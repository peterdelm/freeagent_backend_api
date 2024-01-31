const { v4: uuidv4 } = require("uuid");
const { User } = require("./user.model");
const { Conversation } = require("./conversation.model");

module.exports = (sequelize, Sequelize) => {
  const Participant = sequelize.define("participant", {
    id: {
      type: Sequelize.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    conversationId: {
      type: Sequelize.UUID,
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

  Participant.associate = (models) => {
    Participant.belongsTo(User, { foreignKey: "userId" });
    Participant.belongsTo(Conversation, {
      foreignKey: "conversationId",
    });
  };

  return Participant;
};
