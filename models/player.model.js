module.exports = (sequelize, Sequelize) => {
  const Player = sequelize.define("player", {
    id: {
      type: Sequelize.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
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
    sport: {
      type: Sequelize.STRING,
    },
    position: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
    },
    userId: {
      type: Sequelize.UUID,
      references: {
        model: "users", // This should match the table name of the User model
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

  return Player;
};
