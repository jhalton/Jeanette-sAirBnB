"use strict";
const bcrypt = require("bcryptjs");
const { query } = require("express");

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
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(
      options,
      [
        {
          userId: 2,
          spotId: 1,
          review:
            "This place is great! Except I'm fairly certain it's a bread factory and not a house.",
          stars: 4,
        },
        {
          userId: 1,
          spotId: 2,
          review: `It's very small, but that's ok. It's cozy like a coffin.`,
          stars: 3,
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
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        userId: { [Op.in]: [1, 2] },
      },
      {}
    );
  },
};
