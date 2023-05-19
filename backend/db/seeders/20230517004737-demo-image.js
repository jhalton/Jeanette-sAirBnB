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
          preview: true,
        },
        {
          imageableId: 2,
          imageableType: "Spot",
          url: "https://media-cdn.tripadvisor.com/media/photo-s/0b/9f/cb/13/melo-s-pizza-pasta-pleasant.jpg",
          preview: true,
        },
        {
          imageableId: 2,
          imageableType: "Review",
          url: "https://media-cdn.tripadvisor.com/media/photo-s/0b/9f/cb/13/melo-s-pizza-pasta-pleasant.jpg",
          preview: true,
        },
        {
          imageableId: 1,
          imageableType: "Spot",
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0aAW_kKi7DwLkvWNtr_M6BiJIroSc5mvCgOOsR-iVyg&usqp=CAU&ec=48665701",
          preview: false,
        },
        {
          imageableId: 3,
          imageableType: "Spot",
          url: "https://upload.wikimedia.org/wikipedia/commons/2/26/Monterey_Bay_Aquarium_exterior_August_2016.jpg",
          preview: true,
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
        imageableId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
