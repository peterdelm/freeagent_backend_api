"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Games", {
      id: {
        type: Sequelize.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
        validate: {
          isDate: {
            msg: "Please enter a valid date",
          },
        },
      },
      time: {
        type: Sequelize.TIME,
        validate: {
          is: {
            args: /^([01]\d|2[0-3]):([0-5]\d)$/,
            msg: "Please enter a valid time",
          },
        },
      },
      sport: {
        type: Sequelize.STRING,
      },
      gameLength: {
        type: Sequelize.STRING,
      },
      calibre: {
        type: Sequelize.STRING,
      },
      gameType: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      position: {
        type: Sequelize.STRING,
      },
      teamName: {
        type: Sequelize.STRING,
      },
      additionalInfo: {
        type: Sequelize.TEXT,
      },
      matchedPlayerId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      isActive: {
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Games");
  },
};
