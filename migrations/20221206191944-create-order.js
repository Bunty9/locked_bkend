"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("orders", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            orderId: {
                type: Sequelize.STRING,
            },
            platform: {
                type: Sequelize.STRING,
            },
            type: {
                type: Sequelize.STRING,
            },
            state: {
                type: Sequelize.STRING,
            },
            symbol: {
                type: Sequelize.STRING,
            },
            magic: {
                type: Sequelize.STRING,
            },
            time: {
                type: Sequelize.STRING,
            },
            brokerTime: {
                type: Sequelize.STRING,
            },
            openPrice: {
                type: Sequelize.STRING,
            },
            volume: {
                type: Sequelize.STRING,
            },
            currentVolume: {
                type: Sequelize.STRING,
            },
            positionId: {
                type: Sequelize.STRING,
            },
            reason: {
                type: Sequelize.STRING,
            },
            currentPrice: {
                type: Sequelize.STRING,
            },
            accountCurrencyExchangeRate: {
                type: Sequelize.STRING,
            },
            brokerComment: {
                type: Sequelize.STRING,
            },
            stopLoss: {
                type: Sequelize.STRING,
            },
            takeProfit: {
                type: Sequelize.STRING,
            },
            comment: {
                type: Sequelize.STRING,
            },
            clientId: {
                type: Sequelize.STRING,
            },
            updateSequenceNumber: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable("orders");
    },
};
