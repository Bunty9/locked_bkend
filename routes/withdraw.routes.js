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
    //get all withdraws
    app.get("/api/withdraw/all", async (req, res) => {
        res.json({ msg: "withdraws" });
    });
    //create withdraw setting
    app.post("/api/withdraw/settings", async (req, res) => {
        res.json({ msg: "withdraw settings" });
    });
    //create withdraw
    app.post("/api/withdraw/create", async (req, res) => {
        res.json({ msg: "create withdraw" });
    });
};
