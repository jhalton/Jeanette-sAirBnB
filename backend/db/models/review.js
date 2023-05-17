"use strict";
const { Model } = require("sequelize");
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
      Review.belongsToMany(models.Spot, {
        foreignKey: "spotId",
      });
      Review.hasMany(models.Image, {
        foreignKey: "imageableId",
        constraints: false,
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
        type: DataTypes.DECIMAL,
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
