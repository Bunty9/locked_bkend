'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dashboards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      balance: {
        type: Sequelize.STRING
      },
      equity: {
        type: Sequelize.STRING
      },
      startingbalance: {
        type: Sequelize.STRING
      },
      netprofit: {
        type: Sequelize.STRING
      },
      netloss: {
        type: Sequelize.STRING
      },
      trades: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('dashboards');
  }
};