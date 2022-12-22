'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class metatrader extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  metatrader.init({
    userId: DataTypes.INTEGER,
    serverId: DataTypes.STRING,
    serverPassword: DataTypes.STRING,
    serverName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'metatrader',
  });
  return metatrader;
};