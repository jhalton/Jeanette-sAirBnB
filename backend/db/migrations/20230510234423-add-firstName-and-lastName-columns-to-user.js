"use strict";
let options = {};
options.tableName = "Users";

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const { query } = require("express");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(options, "firstName", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn(options, "lastName", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(options, "firstname");

    await queryInterface.removeColumn(options, "lastName");
  },
};
