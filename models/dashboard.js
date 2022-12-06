'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dashboard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  dashboard.init({
    userId: DataTypes.INTEGER,
    broker: DataTypes.STRING,
    currency: DataTypes.STRING,
    server: DataTypes.STRING,
    balance: DataTypes.STRING,
    equity: DataTypes.STRING,
    margin: DataTypes.STRING,
    freeMargin: DataTypes.STRING,
    leverage: DataTypes.STRING,
    marginLevel: DataTypes.STRING,
    type: DataTypes.STRING,
    name: DataTypes.STRING,
    login: DataTypes.STRING,
    credit: DataTypes.STRING,
    platform: DataTypes.STRING,
    marginMode: DataTypes.STRING,
    tradeAllowed: DataTypes.STRING,
    investorMode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'dashboard',
  });
  return dashboard;
};