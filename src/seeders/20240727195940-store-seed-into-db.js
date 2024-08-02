"use strict";

const { generateStoreCodeJs } = require('../helper/codeGeneratorJs');
const fs = require('fs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(
      fs.readFileSync(__dirname + "/../../dummy/store.json", "utf-8")
    ).map((item) => {
      item.code = generateStoreCodeJs(
        item.ownerUsername,
        item.category,
        item.location,
        new Date(),
        item.OwnerId
      );
      item.createdAt = item.updatedAt = new Date();
      delete item.ownerUsername
      return item;
    });

    await queryInterface.bulkInsert("Stores", data, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Stores", null, {});
  },
};
