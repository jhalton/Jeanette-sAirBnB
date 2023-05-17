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
    options.tableName = "Spots";
    return queryInterface.bulkInsert(options, [
      {
        name: "Test",
        address: "123 Test Ave",
        city: "Test",
        state: "OR",
        country: "USA",
        lat: 37.8087,
        lng: 122.4098,
        description:
          "A cute little make-believe place with plenty of natural light and high ceilings!",
        price: 99,
        preview_img: null,
        ownerId: 1,
      },
      {
        name: "Test2",
        address: "456 Test Ave",
        city: "Somewhere Fun",
        state: "CA",
        country: "USA",
        lat: 37.973699,
        lng: -122.064374,
        description: `Call it cozy or quaint, but we all know that means it's 200 sq ft.`,
        price: 400,
        preview_img: null,
        ownerId: 2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["Test", "Test2"] },
      },
      {}
    );
  },
};
