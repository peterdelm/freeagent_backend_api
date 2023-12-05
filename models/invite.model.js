const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const Invite = sequelize.define("invite", {
    id: {
      type: Sequelize.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    potentialPlayerIds: {
      type: Sequelize.ARRAY(Sequelize.UUID),
    },
    refusedPlayerIds: {
      type: Sequelize.ARRAY(Sequelize.UUID),
    },
    acceptedPlayerIds: {
      type: Sequelize.UUID,
    },
    status: {
      type: Sequelize.STRING,
    },
    gameId: {
      type: Sequelize.UUID,
      references: {
        model: "games", // This should match the table name of the User model
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

  return Invite;
};
