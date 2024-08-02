"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Stores", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNullL: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNullL: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNullL: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNullL: false,
        // username owner-ownerId-kota-date
      },
      OwnerId: {
        type: Sequelize.INTEGER,
        allowNullL: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Stores");
  },
};
