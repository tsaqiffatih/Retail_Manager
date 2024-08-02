'use strict';
const fs = require('fs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = JSON.parse(
      fs.readFileSync(__dirname + "/../../dummy/payroll.json", "utf-8")
    ).map((item) => {
      item.createdAt = item.updatedAt = new Date();
      return item;
    });

     await queryInterface.bulkInsert('Payrolls', data, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
    */
    await queryInterface.bulkDelete('Payrolls', null, {});
  }
};
