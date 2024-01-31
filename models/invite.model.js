const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const Invite = sequelize.define("invite", {
    id: {
      type: Sequelize.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    playerId: {
      type: Sequelize.UUID,
      references: {
        model: "players", // This should match the table name of the User model
        key: "id", // This should match the primary key of the User model
      },
      allowNull: false,
    },
    gameId: {
      type: Sequelize.UUID,
      references: {
        model: "games", // This should match the table name of the User model
        key: "id", // This should match the primary key of the User model
      },
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: "active",
    },
    accepted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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

  Invite.associate = (models) => {
    Invite.belongsTo(models.Game, { foreignKey: "gameId" });
    Invite.belongsTo(models.Player, { foreignKey: "playerId" });
  };

  return Invite;
};
