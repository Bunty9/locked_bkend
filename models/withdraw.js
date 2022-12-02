"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class withdraw extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    withdraw.init(
        {
            userId: DataTypes.INTEGER,
            methodId: DataTypes.INTEGER,
            method: DataTypes.STRING,
            amount: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "withdraw",
        }
    );
    return withdraw;
};
