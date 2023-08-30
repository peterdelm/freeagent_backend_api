"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Starting seeder: MySeeder");
    await queryInterface.bulkInsert(
      "Sports",
      [
        {
          sport: "Hockey",
          game_length: JSON.stringify(["60", "90", "120"]),
          game_type: JSON.stringify(["5v5", "3v3"]),
          calibre: JSON.stringify(["AAA", "AA", "A"]),
          position: JSON.stringify(["Goalie", "Forward"]),
        },
        {
          sport: "Soccer",
          game_length: JSON.stringify(["60", "90", "120"]),
          game_type: JSON.stringify(["5v5", "3v3"]),
          calibre: JSON.stringify(["AAA", "AA", "A"]),
          position: JSON.stringify(["Goalie", "Forward"]),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Sports", null, {});
  },
};
