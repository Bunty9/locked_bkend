"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
const db = {};

var sequelize = new Sequelize(
    "postgres://gesmxhqx:yaxI2Dgn1Haj7B-HaoXoxBk1j_QHQkrB@peanut.db.elephantsql.com/gesmxhqx",
    {
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
    }
);

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
db.Admin = require("./admin")(sequelize, Sequelize.DataTypes);
db.Dashboard = require("./dashboard")(sequelize, Sequelize.DataTypes);
db.WithdrawSetting = require("./withdrawsetting")(
    sequelize,
    Sequelize.DataTypes
);
db.Withdraw = require("./withdraw")(sequelize, Sequelize.DataTypes);
db.WithdrawMethod = require("./withdrawmethod")(sequelize, Sequelize.DataTypes);
db.Contact = require("./contact")(sequelize, Sequelize.DataTypes);
db.Position = require("./position")(sequelize, Sequelize.DataTypes);
db.Order = require("./order")(sequelize, Sequelize.DataTypes);
db.MetaTrader = require("./metatrader")(sequelize, Sequelize.DataTypes);

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
db.User.hasOne(db.MetaTrader, {
    foreignKey: "userId",
    as: "metatrader",
});
db.MetaTrader.belongsTo(db.User, {
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
db.User.hasMany(db.Contact, {
    foreignKey: "userId",
    as: "contact",
});
db.Contact.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
});
db.User.hasMany(db.Withdraw, {
    foreignKey: "userId",
    as: "withdraws",
});
db.Withdraw.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
});
db.User.hasMany(db.Position, {
    foreignKey: "userId",
    as: "positions",
});
db.Position.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
});
db.User.hasMany(db.Order, {
    foreignKey: "userId",
    as: "orders",
});
db.Order.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
});

module.exports = db;
