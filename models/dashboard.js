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
    balance: DataTypes.STRING,
    equity: DataTypes.STRING,
    startingbalance: DataTypes.STRING,
    netprofit: DataTypes.STRING,
    netloss: DataTypes.STRING,
    trades: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'dashboard',
  });
  return dashboard;
};