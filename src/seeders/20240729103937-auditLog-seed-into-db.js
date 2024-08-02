'use strict';
const fs = require('fs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = JSON.parse(
      fs.readFileSync(__dirname + "/../../dummy/auditLog.json", "utf-8")
    ).map((item) => {
      item.timestamp = new Date()
      item.createdAt = item.updatedAt = new Date();
      return item;
    });

     await queryInterface.bulkInsert('AuditLogs', data, {});
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('AuditLogs', null, {});
  }
};
