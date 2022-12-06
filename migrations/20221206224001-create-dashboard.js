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
      broker: {
        type: Sequelize.STRING
      },
      currency: {
        type: Sequelize.STRING
      },
      server: {
        type: Sequelize.STRING
      },
      balance: {
        type: Sequelize.STRING
      },
      equity: {
        type: Sequelize.STRING
      },
      margin: {
        type: Sequelize.STRING
      },
      freeMargin: {
        type: Sequelize.STRING
      },
      leverage: {
        type: Sequelize.STRING
      },
      marginLevel: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      login: {
        type: Sequelize.STRING
      },
      credit: {
        type: Sequelize.STRING
      },
      platform: {
        type: Sequelize.STRING
      },
      marginMode: {
        type: Sequelize.STRING
      },
      tradeAllowed: {
        type: Sequelize.STRING
      },
      investorMode: {
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