"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
      });
      Spot.hasMany(models.Booking, {
        foreignKey: "spotId",
      });
      Spot.hasMany(models.Image, {
        foreignKey: "imageableId",
        constraints: false,
        scope: {
          imageableType: "Spot",
        },
      });
      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
      });
    }
  }
  Spot.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      lng: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      preview_img: {
        type: DataTypes.STRING,
      },
      ownerId: {
        type: DataTypes.STRING,
        references: {
          model: "User",
          key: "id",
        },
        onDelete: "CASCADE",
        hooks: true,
      },
    },
    {
      sequelize,
      modelName: "Spot",
      indexes: [{ fields: ["address", "city", "state"], unique: true }],
    }
  );
  return Spot;
};
