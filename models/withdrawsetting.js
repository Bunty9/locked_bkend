'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class withdrawsetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  withdrawsetting.init({
    userId: DataTypes.INTEGER,
    payoutfreq: DataTypes.STRING,
    withdraw: DataTypes.STRING,
    compound: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'withdrawsetting',
  });
  return withdrawsetting;
};