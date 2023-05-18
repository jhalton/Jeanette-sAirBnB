"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    options.tableName = "Images";
    return queryInterface.bulkInsert(
      options,
      [
        {
          imageableId: 1,
          imageableType: "Spot",
          url: "https://boudinbakery.com/wp-content/uploads/2017/02/boudin-wharf-1-full.jpeg",
        },
        {
          imageableId: 2,
          imageableType: "Spot",
          url: "https://media-cdn.tripadvisor.com/media/photo-s/0b/9f/cb/13/melo-s-pizza-pasta-pleasant.jpg",
        },
        {
          imageableId: 2,
          imageableType: "Review",
          url: "https://media-cdn.tripadvisor.com/media/photo-s/0b/9f/cb/13/melo-s-pizza-pasta-pleasant.jpg",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Images";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        imageableId: { [Op.in]: [1, 2] },
      },
      {}
    );
  },
};
