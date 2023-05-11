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
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          email: "demo@user.io",
          username: "Gary-Oldman",
          hashedPassword: bcrypt.hashSync("password"),
          firstName: "Gary",
          lastName: "Oldman",
        },
        {
          email: "user1@user.io",
          username: "Meryl-Streep",
          hashedPassword: bcrypt.hashSync("password2"),
          firstName: "Meryl",
          lastName: "Streep",
        },
        {
          email: "user2@user.io",
          username: "Stanley-Tucci",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "Stanley",
          lastName: "Tucci",
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
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ["Gary-Oldman", "Meryl-Streep", "Stanley-Tucci"] },
      },
      {}
    );
  },
};
