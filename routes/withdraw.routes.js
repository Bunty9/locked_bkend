const db = require("../models");
const Dashboard = db.Dashboard;
const Withdraw = db.Withdraw;
const WithdrawSetting = db.WithdrawSetting;
const WithdrawMethod = db.WithdrawMethod;

module.exports = function (app, passport) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    //get all withdraws
    app.post(
        "/api/withdraw/all",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            // res.json({ msg: "withdraws" });
            await Withdraw.findAll({ where: { userId: req.user.id } })
                .then((data) => {
                    res.json({ data });
                })
                .catch((err) => {
                    res.json({ msg: ">> Error while compiling data: ", err });
                });
        }
    );
    //create withdraw setting
    app.post(
        "/api/withdraw/settings",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            // res.json({ msg: "withdraw settings" });
            await WithdrawSetting.create({
                userId: req.body.userId,
                payoutfreq: req.body.payoutfreq,
                withdraw: req.body.withdraw,
                compound: req.body.compound,
            })
                .then(() => {
                    res.json({ msg: "Withdraw settings saved" });
                })
                .catch((err) => {
                    res.json({ msg: ">> Error while saving data: ", err });
                });
        }
    );
    //create withdraw
    app.post(
        "/api/withdraw/create",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            // res.json({ msg: "create withdraw" });
            await Withdraw.create({
                userId: req.body.userId,
                methodId: req.body.methodId,
                method: req.body.method,
                amount: req.body.amount,
            })
                .then((result) => {
                    res.json({ msg: "Withdraw request saved", result });
                })
                .catch((err) => {
                    res.json({ msg: ">> Error while saving data: ", err });
                });
        }
    );
    //new withdraw method
    app.post(
        "/api/withdraw/newmethod",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            // res.json({ msg: "new withdraw method" });
            await WithdrawMethod.create({
                userId: req.body.userId,
                method: req.body.method,
                bankacc: req.body.bankacc,
                cryptoid: req.body.cryptoid,
            })
                .then(() => {
                    res.json({ msg: "Withdraw method saved" });
                })
                .catch((err) => {
                    res.json({ msg: ">> Error while saving data: ", err });
                });
        }
    );
    //get all withdraw methods
    app.post(
        "/api/withdraw/methods",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            // res.json({ msg: "withdraw methods" });
            await WithdrawMethod.findAll({ where: { userId: req.user.id } })
                .then((data) => {
                    res.json({ data });
                })
                .catch((err) => {
                    res.json({ msg: ">> Error while compiling data: ", err });
                });
        }
    );
    //get all withdraw settings
    app.post(
        "/api/withdraw/getsettings",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            // res.json({ msg: "withdraw settings" });
            await WithdrawSetting.findOne({
                where: { userId: req.user.id },
            })
                .then((data) => {
                    res.json({ data });
                })
                .catch((err) => {
                    res.json({ msg: ">> Error while compiling data: ", err });
                });
        }
    );
};
