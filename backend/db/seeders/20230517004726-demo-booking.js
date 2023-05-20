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
    options.tableName = "Bookings";
    await queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 3,
          startDate: "2024-06-01",
          endDate: "2024-06-05",
        },
        {
          spotId: 2,
          userId: 1,
          startDate: "2024-06-18",
          endDate: "2024-06-25",
        },
        {
          spotId: 3,
          userId: 2,
          startDate: "2024-08-13",
          endDate: "2024-08-20",
        },

        {
          //This is intentionally before today's date
          spotId: 3,
          userId: 4,
          startDate: "2023-02-01",
          endDate: "2023-02-02",
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
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2] },
      },
      {}
    );
  },
};
