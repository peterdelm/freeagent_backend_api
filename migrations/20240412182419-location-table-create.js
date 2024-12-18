"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Locations", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      longitude: {
        allowNull: false,
        type: Sequelize.DOUBLE,
      },
      latitude: {
        allowNull: false,
        type: Sequelize.DOUBLE,
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      gameId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Games",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      playerId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Players",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Locations");
  },
};
