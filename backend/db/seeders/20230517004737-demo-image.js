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
        {
          imageableId: 4,
          imageableType: "Spot",
          url: "https://verbenasimpleliving.files.wordpress.com/2010/09/h3.jpg",
          preview: true,
        },
        {
          imageableId: 4,
          imageableType: "Spot",
          url: "https://www.priceypads.com/wp-content/uploads/2020/09/Untitled-1.jpg",
          preview: false,
        },
        {
          imageableId: 4,
          imageableType: "Spot",
          url: "https://www.atticmag.com/wp-content/uploads/2010/10/kit-wht-pracmagic1-435.jpg",
          preview: false,
        },
        {
          imageableId: 4,
          imageableType: "Spot",
          url: "https://i0.wp.com/themoderndigest.com/wp-content/uploads/2020/10/Screenshot-2020-10-21-at-4.42.36-PM.png?resize=1024%2C417&ssl=1",
          preview: false,
        },
        {
          imageableId: 4,
          imageableType: "Spot",
          url: "https://2.bp.blogspot.com/-UloqgGy8GLg/Tnz21vCINSI/AAAAAAAAIyI/r9k4O7Kpa6M/s1600/kitchentable2.jpg",
          preview: false,
        },
        {
          imageableId: 5,
          imageableType: "Spot",
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5wIrrOJIf0RRSH3kjRzx4I7vkIWGk-jc97w&usqp=CAU",
          preview: true,
        },
        {
          imageableId: 5,
          imageableType: "Spot",
          url: "https://44.media.tumblr.com/48d209bb715aee5100237cfb13439d21/tumblr_pbw85uhXoY1qmob6ro1_400.gif",
          preview: false,
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
