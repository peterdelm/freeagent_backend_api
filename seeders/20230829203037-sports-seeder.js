// seeders/20220129120000-sample-sports.js

const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config.js");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const Sport = require("../models/sport.model")(sequelize);
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert sample sports data into the "sports" table
    await Sport.bulkCreate([
      {
        sport: "Hockey",
        game_length: [60, 90, 120],
        game_type: ["3v3 (Ice)", "5v5 (Ice)", "5v5 (Floor)"],
        calibre: [
          "A (Semi Pro / Major Jr experience)",
          "B (Jr B/C, Varsity, AA/AAA experience)",
          "C (Select, Rep / All Star, A experience)",
          "D (House League experience)",
          "E (little/ no experience)",
          "Any",
        ],
        position: ["Goaltender", "Any non-goalie", "Forward", "Defence"],
      },
      {
        sport: "Soccer",
        game_length: [60, 90, 120],
        game_type: [
          "11v11 (Outdoor - Grass)",
          "11v11 (Outdoor - Turf)",
          "7v7 (Outdoor - Grass)",
          "7v7 (Outdoor - Turf)",
          "6v6 (Outdoor - Grass)",
          "6v6 (Outdoor - Turf)",
          "6v6 (Indoor - Turf)",
        ],
        calibre: ["Recreational", "Intermediate", "Advanced", "Any"],
        position: [
          "Goaltender",
          "Any non-goalie",
          "Forward",
          "Midfielder",
          "Defence",
        ],
      },
      {
        sport: "Volleyball",
        game_length: [60, 90, 120],
        game_type: [
          "6v6 (Outdoor - Beach)",
          "6v6 (Indoor - Beach)",
          "6v6 (Indoor - Court)",
          "4v4 (Outdoor - Beach)",
          "2v2 (Indoor - Beach)",
          "2v2 (Indoor - Court)",
        ],
        calibre: ["Recreational", "Intermediate", "Advanced", "Any"],
        position: ["Any", "Setter", "Hitter", "Libero", "Blocker"],
      },
      {
        sport: "Ultimate Frisbee",
        game_length: [60, 90, 120],
        game_type: [
          "7v7 (Outdoor - Grass)",
          "7v7 (Outdoor - Turf)",
          "7v7 (Indoor - Grass)",
          "7v7 (Indoor - Turf)",
          "6v6 (Outdoor - Grass)",
          "6v6 (Outdoor - Turf)",
          "6v6 (Indoor - Grass)",
          "6v6 (Indoor - Turf)",
          "5v5 (Outdoor - Grass)",
          "5v5 (Outdoor - Turf)",
          "5v5 (Indoor - Grass)",
          "5v5 (Indoor - Turf)",
        ],
        calibre: ["Recreational", "Intermediate", "Advanced", "Any"],
        position: ["Any", "Handler", "Cutter"],
      },
      {
        sport: "Basketball",
        game_length: [60, 90, 120],
        game_type: [
          "5v5 (Outdoor)",
          "5v5 (Indoor)",
          "4v4 (Outdoor)",
          "4v4 (Indoor)",
          "3v3 (Outdoor)",
          "3v3 (Indoor)",
        ],
        calibre: ["Recreational", "Competitive", "Any"],
        position: [
          "Any",
          "Point Guard",
          "Shooting Guard",
          "Small Forward",
          "Power Forward",
          "Center",
        ],
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the sample sports data
    await Sport.destroy({
      where: {
        name: [
          "Soccer",
          "Basketball",
          "Hockey",
          "Ultimate Frisbee",
          "Volleyball",
        ],
      },
    });
  },
};
