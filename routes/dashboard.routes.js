const db = require("../models");
const Dashboard = db.Dashboard;

module.exports = function (app, sequelize, passport) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/dashboard/create", async (req, res) => {
        await Dashboard.create({
            userId: req.body.userId,
            balance: req.body.balance,
            equity: req.body.equity,
            startingbalance: req.body.startingbalance,
            netprofit: req.body.netprofit,
            netloss: req.body.netloss,
            trades: req.body.trades,
        })
            .then((result) => {
                res.json({ msg: "Dashboard data saved", result });
            })
            .catch((err) => {
                console.log(err);
                res.json({ msg: ">> Error while saving data: ", err });
            });
    });

    app.post("/api/dashboard/all", async (req, res) => {
        await Dashboard.findAll({ where: { userId: req.body.userId } })
            .then((result) => {
                res.json({ data: result });
            })
            .catch((err) => {
                console.log(err);
                res.json({ msg: ">> Error while compiling data: ", err });
            });
    });
};
