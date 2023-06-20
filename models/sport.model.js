module.exports = (sequelize, Sequelize) => {
  const Sport = sequelize.define("sport", {
    name: {
      type: Sequelize.STRING,
    },
    game_length: {
      type: Sequelize.STRING,
    },
    game_type: {
      type: Sequelize.STRING,
    },
    calibre: {
      type: Sequelize.DATE,
    },
    position: {
      type: Sequelize.STRING,
    },
  });

  return Sport;
};
