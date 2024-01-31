"use strict";
// const DataTypes = require("sequelize"); // Import DataTypes from Sequelize

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Sports", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sport: {
        type: Sequelize.STRING,
      },
      gameLength: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      gameType: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      calibre: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      position: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      gender: {
        type: Sequelize.ARRAY(Sequelize.STRING),
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
    await queryInterface.dropTable("Sports");
  },
};
