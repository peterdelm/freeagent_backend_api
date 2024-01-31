"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Players", {
      id: {
        type: Sequelize.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
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
      yearsPlayed: {
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
      gameLength: {
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
      isActive: {
        type: Sequelize.BOOLEAN,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: "Users", // This should match the table name of the User model
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Players");
  },
};
