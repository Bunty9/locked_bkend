'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class withdrawmethod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  withdrawmethod.init({
    userId: DataTypes.INTEGER,
    method: DataTypes.STRING,
    bankacc: DataTypes.STRING,
    cryptoid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'withdrawmethod',
  });
  return withdrawmethod;
};