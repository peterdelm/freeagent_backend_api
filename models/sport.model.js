module.exports = (sequelize, Sequelize) => {
  const Sport = sequelize.define(
    "sport",
    {
      sport: {
        type: Sequelize.STRING,
      },
      game_length: {
        type: Sequelize.STRING,
      },
      game_type: {
        type: Sequelize.STRING,
      },
      calibre: {
        type: Sequelize.STRING,
      },
      position: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
    },
    { timestamps: false }
  );

  return Sport;
};
