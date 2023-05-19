"use strict";
const { Model, Validator } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Review, {
        foreignKey: "commentableId",
        constraints: false,
      });
      Image.belongsTo(models.Spot, {
        foreignKey: "commentableId",
        constraints: false,
        as: "imageable",
      });
    }
  }
  Image.init(
    {
      imageableId: {
        type: DataTypes.INTEGER,
      },
      imageableType: {
        type: DataTypes.ENUM("Review", "Spot"),
      },
      url: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Image",
    }
  );
  return Image;
};
