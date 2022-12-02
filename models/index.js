"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
const db = {};

var sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Dashboard = require("./dashboard")(sequelize, Sequelize.DataTypes);
db.WithdrawSetting = require("./withdrawsetting")(
    sequelize,
    Sequelize.DataTypes
);
db.Withdraw = require("./withdraw")(sequelize, Sequelize.DataTypes);
db.WithdrawMethod = require("./withdrawmethod")(sequelize, Sequelize.DataTypes);

db.User.hasMany(db.Dashboard, {
    foreignKey: "userId",
    as: "dashboards",
});
db.Dashboard.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
});
db.User.hasOne(db.WithdrawSetting, {
    foreignKey: "userId",
    as: "withdrawsetting",
});
db.WithdrawSetting.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
});
db.User.hasMany(db.WithdrawMethod, {
    foreignKey: "userId",
    as: "withdrawmethod",
});
db.WithdrawMethod.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
});

module.exports = db;