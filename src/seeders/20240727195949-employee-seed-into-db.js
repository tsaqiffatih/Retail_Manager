'use strict';
const fs = require('fs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = JSON.parse(
      fs.readFileSync(__dirname + "/../../dummy/employee.json", "utf-8")
    ).map((item) => {
      item.createdAt = item.updatedAt = new Date();
      return item;
    });

     await queryInterface.bulkInsert('Employees', data, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
    */
    await queryInterface.bulkDelete('Employees', null, {});
  }
};
