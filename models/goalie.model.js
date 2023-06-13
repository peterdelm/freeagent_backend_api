module.exports = (sequelize, Sequelize) => {
  const Goalie = sequelize.define("goalie", {
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    birthdate: {
      type: Sequelize.DATE,
    },
    gender: {
      type: Sequelize.STRING,
    },
    years_played: {
      type: Sequelize.INTEGER,
    },
    personal_calibre: {
      type: Sequelize.STRING,
    },
    game_length: {
      type: Sequelize.INTEGER,
    },
    travel_range: {
      type: Sequelize.INTEGER,
    },
    bio: {
      type: Sequelize.TEXT,
    },
  });

  return Goalie;
};
