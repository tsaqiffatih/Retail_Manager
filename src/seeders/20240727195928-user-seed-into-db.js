'use strict';

const { hashPassword } = require('../helper/bcryptJs');
const fs = require('fs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = JSON.parse(
      fs.readFileSync(__dirname + "/../../dummy/user.json", "utf-8")
    ).map((item) => {
      item.password = hashPassword(item.password)
      item.createdAt = item.updatedAt = new Date();
      return item;
    });

     await queryInterface.bulkInsert('Users', data, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
    */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
