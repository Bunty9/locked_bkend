const db = require("../models");

const Order = db.Order;
const { Op, DATE } = require("sequelize");

// weekly earings
// get all orders where time < this week and send cumulated profit

const week1 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const week2 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
const week3 = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000);
const week4 = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
const month1 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const month2 = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
const month3 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
const month4 = new Date(Date.now() - 120 * 24 * 60 * 60 * 1000);
const endDate = new Date(Date.now());

module.exports = function (app, passport) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get(
        "/api/user/week1/profit",
        [passport.authenticate("user_auth")],
        async (req, res) => {
            await Order.findAll({
                where: {
                    createdAt: { [Op.between]: [week1, endDate] },
                },
            })
                .then((week1) => {
                    let total = 0;
                    for (let i = 0; i < week1.length; i++) {
                        total = total + parseInt(week1[i].takeProfit); //current price - open price * volume
                    }
                    // console.log(total);
                    res.json({ totalProfit: total });
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    );
    app.get(
        "/api/user/week2/profit",
        [passport.authenticate("user_auth")],
        async (req, res) => {
            await Order.findAll({
                where: {
                    createdAt: { [Op.between]: [week2, week1] },
                },
            })
                .then((week2) => {
                    let total = 0;
                    for (let i = 0; i < week2.length; i++) {
                        total = total + parseInt(week2[i].takeProfit);
                    }
                    // console.log(total);
                    res.json({ totalProfit: total });
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    );
    app.get(
        "/api/user/week3/profit",
        [passport.authenticate("user_auth")],
        async (req, res) => {
            await Order.findAll({
                where: {
                    createdAt: { [Op.between]: [week3, week2] },
                },
            })
                .then((week3) => {
                    let total = 0;
                    for (let i = 0; i < week3.length; i++) {
                        total = total + parseInt(week3[i].takeProfit);
                    }
                    // console.log(total);
                    res.json({ totalProfit: total });
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    );
    app.get(
        "/api/user/week4/profit",
        [passport.authenticate("user_auth")],
        async (req, res) => {
            await Order.findAll({
                where: {
                    createdAt: { [Op.between]: [week4, week3] },
                },
            })
                .then((week4) => {
                    let total = 0;
                    for (let i = 0; i < week4.length; i++) {
                        total = total + parseInt(week4[i].takeProfit);
                    }
                    // console.log(total);
                    res.json({ totalProfit: total });
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    );
    app.get(
        "/api/user/month1/profit",
        [passport.authenticate("user_auth")],
        async (req, res) => {
            await Order.findAll({
                where: {
                    createdAt: { [Op.between]: [month1, endDate] },
                },
            })
                .then((month1) => {
                    let total = 0;
                    for (let i = 0; i < month1.length; i++) {
                        total = total + parseInt(month1[i].takeProfit);
                    }
                    // console.log(total);
                    res.json({ totalProfit: total });
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    );
    app.get(
        "/api/user/month2/profit",
        [passport.authenticate("user_auth")],
        async (req, res) => {
            await Order.findAll({
                where: {
                    createdAt: { [Op.between]: [month2, month1] },
                },
            })
                .then((month2) => {
                    let total = 0;
                    for (let i = 0; i < month2.length; i++) {
                        total = total + parseInt(month2[i].takeProfit);
                    }
                    // console.log(total);
                    res.json({ totalProfit: total });
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    );
    app.get(
        "/api/user/month3/profit",
        [passport.authenticate("user_auth")],
        async (req, res) => {
            await Order.findAll({
                where: {
                    createdAt: { [Op.between]: [month3, month2] },
                },
            })
                .then((month3) => {
                    let total = 0;
                    for (let i = 0; i < month3.length; i++) {
                        total = total + parseInt(month3[i].takeProfit);
                    }
                    // console.log(total);
                    res.json({ totalProfit: total });
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    );
    app.get(
        "/api/user/month4/profit",
        [passport.authenticate("user_auth")],
        async (req, res) => {
            await Order.findAll({
                where: {
                    createdAt: { [Op.between]: [month4, month3] },
                },
            })
                .then((month4) => {
                    let total = 0;
                    for (let i = 0; i < month4.length; i++) {
                        total = total + parseInt(month4[i].takeProfit);
                    }
                    // console.log(total);
                    res.json({ totalProfit: total });
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    );

    app.post(
        "/api/user/cumulated/profit",
        [passport.authenticate("user_auth")],
        async (req, res) => {
            // const now = Date(Date.now());
            const start = new Date(Date.parse(req.body.start));
            const end = new Date(Date.parse(req.body.end));
            await Order.findAll({
                where: {
                    userId: req.user.id,
                    createdAt: { [Op.between]: [start, end] },
                },
            })
                .then((data) => {
                    console.log(req.user.id);
                    let total = 0;
                    for (let i = 0; i < data.length; i++) {
                        total =
                            total +
                            (parseFloat(data[i].currentPrice) -
                                parseFloat(data[i].openPrice)) *
                                parseFloat(data[i].volume);
                    }

                    res.json({ totalProfit: total });
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    );
    app.post(
        "/api/admin/cumulated/profit",
        [passport.authenticate("admin_auth")],
        async (req, res) => {
            // const now = Date(Date.now());
            const start = new Date(Date.parse(req.body.start));
            const end = new Date(Date.parse(req.body.end));
            await Order.findAll({
                where: {
                    createdAt: { [Op.between]: [start, end] },
                },
            })
                .then((data) => {
                    let total = 0;
                    for (let i = 0; i < data.length; i++) {
                        total =
                            total +
                            (parseFloat(data[i].currentPrice) -
                                parseFloat(data[i].openPrice)) *
                                parseFloat(data[i].volume);
                    }
                    // console.log(total);
                    res.json({ totalProfit: total });
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    );
    app.post(
        "/api/admin/peruser/profit",
        [passport.authenticate("admin_auth")],
        async (req, res) => {
            // const now = Date(Date.now());
            const start = new Date(Date.parse(req.body.start));
            const end = new Date(Date.parse(req.body.end));
            await Order.findAll({
                where: {
                    userId: req.body.userId,
                    createdAt: { [Op.between]: [start, end] },
                },
            })
                .then((data) => {
                    let total = 0;
                    for (let i = 0; i < data.length; i++) {
                        total =
                            total +
                            (parseFloat(data[i].currentPrice) -
                                parseFloat(data[i].openPrice)) *
                                parseFloat(data[i].volume);
                    }
                    // console.log(total);
                    res.json({ totalProfit: total });
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    );
};

//monthly earings
// get all orders where time< this month and send cumlative data

//% weekly earnings into percent

// table

//admin charts
//for all users get total profit
//1. daily cumulative
//2. weekly cumulative
//3. monthly culmulative
