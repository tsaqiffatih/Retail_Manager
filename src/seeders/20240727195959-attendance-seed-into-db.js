'use strict';
const fs = require('fs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = JSON.parse(
      fs.readFileSync(__dirname + "/../../dummy/attendance.json", "utf-8")
    ).map((item) => {
      item.createdAt = item.updatedAt = new Date();
      return item;
    });

     await queryInterface.bulkInsert('Attendances', data, {});
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Attendances', null, {});
  }
};
