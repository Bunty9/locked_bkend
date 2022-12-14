"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    order.init(
        {
            userId: DataTypes.INTEGER,
            orderId: DataTypes.STRING,
            platform: DataTypes.STRING,
            type: DataTypes.STRING,
            state: DataTypes.STRING,
            symbol: DataTypes.STRING,
            magic: DataTypes.STRING,
            time: DataTypes.STRING,
            brokerTime: DataTypes.STRING,
            openPrice: DataTypes.STRING,
            volume: DataTypes.STRING,
            currentVolume: DataTypes.STRING,
            positionId: DataTypes.STRING,
            reason: DataTypes.STRING,
            currentPrice: DataTypes.STRING,
            accountCurrencyExchangeRate: DataTypes.STRING,
            brokerComment: DataTypes.STRING,
            stopLoss: DataTypes.STRING,
            takeProfit: DataTypes.STRING,
            comment: DataTypes.STRING,
            clientId: DataTypes.STRING,
            updateSequenceNumber: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "order",
        }
    );
    return order;
};
