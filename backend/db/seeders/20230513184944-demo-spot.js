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
        ownerId: 2,
      },
      {
        name: "Test3",
        address: "789 Test Blvd",
        city: "Monterey",
        state: "CA",
        country: "USA",
        lat: 36.6182,
        lng: 121.9019,
        description: `Spend your days staring at fish, sharks, and eels!`,
        price: 135,
        ownerId: 3,
      },
      {
        name: "Owens Manor",
        address: "555 Magnolia Ln",
        city: "Eastwick",
        state: "MA",
        country: "USA",
        lat: 42.3548,
        lng: -71.0567,
        description: `There are some things I know for certain: always throw spilled salt over your left shoulder, keep rosemary by your garden gate, plant lavender for luck, and fall in love whenever you can.`,
        price: 555,
        ownerId: 2,
      },
      {
        name: "Betelgeuse Blvd",
        address: "1031 Pine St",
        city: "Winter River",
        state: "CT",
        country: "USA",
        lat: 41.1234,
        lng: -72.9876,
        description: `Live people ignore the strange and unusual.`,
        price: 799,
        ownerId: 3,
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
