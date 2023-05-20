"use strict";
const { Model, Validator } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Review.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });
      Review.hasMany(models.Image, {
        foreignKey: "imageableId",
        as: "ReviewImages",
        constraints: false,

        scope: {
          imageableType: "Review",
        },
      });
    }
  }
  Review.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      spotId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Spot",
          key: "id",
        },
      },
      review: {
        type: DataTypes.TEXT,
      },
      stars: {
        type: DataTypes.DECIMAL(2, 1),
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
