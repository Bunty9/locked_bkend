'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class position extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  position.init({
    userId: DataTypes.INTEGER,
    positionId: DataTypes.STRING,
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
    reason: DataTypes.STRING,
    currentPrice: DataTypes.STRING,
    accountCurrencyExchangeRate: DataTypes.STRING,
    brokerComment: DataTypes.STRING,
    stopLoss: DataTypes.STRING,
    takeProfit: DataTypes.STRING,
    comment: DataTypes.STRING,
    clientId: DataTypes.STRING,
    updateSequenceNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'position',
  });
  return position;
};