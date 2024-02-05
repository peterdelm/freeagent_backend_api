"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Player, {
        foreignKey: "userId",
        as: "Players",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      birthdate: DataTypes.DATEONLY,
      password: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      currentRole: {
        type: DataTypes.ENUM("player", "manager"),
        allowNull: false,
        defaultValue: "manager",
        validate: {
          isIn: [["player", "manager"]],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true, // Automatically adds createdAt and updatedAt columns
      updatedAt: "updatedAt", // Customize the name of the updatedAt column if needed
    }
  );
  return User;
};
