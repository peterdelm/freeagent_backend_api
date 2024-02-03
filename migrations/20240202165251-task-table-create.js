"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tasks", {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: () => uuidv4(),
        type: Sequelize.UUID,
      },
      taskType: {
        type: Sequelize.STRING,
      },
      taskInfo: {
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      gameId: {
        type: Sequelize.UUID,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tasks");
  },
};
