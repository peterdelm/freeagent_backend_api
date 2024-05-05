"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Locations", "playerId", {
      type: Sequelize.ARRAY(Sequelize.UUID),
      allowNull: true,
    });

    await queryInterface.changeColumn("Locations", "gameId", {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Locations", "playerId");
    await queryInterface.changeColumn("Locations", "gameId", {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },
};
