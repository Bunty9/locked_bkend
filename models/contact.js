'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  contact.init({
    userId: DataTypes.INTEGER,
    issue: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'contact',
  });
  return contact;
};