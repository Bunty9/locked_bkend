const axios = require("axios").default;
const db = require("../models");
const Order = db.Order;
const Position = db.Position;
const Dashboard = db.Dashboard;

module.exports = function (app, passport) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //history orders
    app.post(
        "/api/meta/order",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            const accountId = req.body.accountId;
            const authtoken = req.headers.metaauthtoken;
            try {
                axios
                    .get(
                        `https://mt-client-api-v1.vint-hill.agiliumtrade.ai/users/current/accounts/${accountId}/orders`,
                        {
                            headers: {
                                "auth-token": authtoken,
                            },
                        }
                    )
                    .then(async (response) => {
                        console.log(response.data);
                        for (let i = 0; i < response.data.length; i++) {
                            await Order.findAll({
                                where: { orderId: response.data[i].id },
                            })
                                .then(async (result) => {
                                    console.log(result[0].orderId);
                                    if (
                                        result[0].orderId ===
                                        response.data[i].id
                                    ) {
                                        console.log("already exists");
                                    } else {
                                        await Order.create({
                                            userId: req.user.id,
                                            orderId: response.data[i].id,
                                            platform: response.data[i].platform,
                                            type: response.data[i].type,
                                            state: response.data[i].state,
                                            symbol: response.data[i].symbol,
                                            magic: response.data[i].magic,
                                            time: response.data[i].time,
                                            brokerTime:
                                                response.data[i].brokerTime,
                                            openPrice:
                                                response.data[i].openPrice,
                                            volume: response.data[i].volume,
                                            currentVolume:
                                                response.data[i].currentVolume,
                                            positionId:
                                                response.data[i].positionId,
                                            reason: response.data[i].reason,
                                            currentPrice:
                                                response.data[i].currentPrice,
                                            accountCurrencyExchangeRate:
                                                response.data[i]
                                                    .accountCurrencyExchangeRate,
                                            brokerComment:
                                                response.data[i].brokerComment,
                                            stopLoss: response.data[i].stopLoss,
                                            takeProfit:
                                                response.data[i].takeProfit,
                                            comment: response.data[i].comment,
                                            clientId: response.data[i].clientId,
                                            updateSequenceNumber:
                                                response.data[i]
                                                    .updateSequenceNumber,
                                        }).catch((err) => {
                                            console.log(err);
                                        });
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                            console.log("success");
                            res.json({ msg: "success" });
                        }
                    });
            } catch (error) {
                res.json({ msg: "error", error });
            }
        }
    );
    //get all orders
    app.get(
        "/api/user/orders",
        [passport.authenticate("user_auth")],
        async (req, res) => {
            await Order.findAll()
                .then((orders) => {
                    console.log(orders);
                    res.json(orders);
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    );
    //sync positions
    app.post(
        "/api/meta/position",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            const accountId = req.body.accountId;
            const authtoken = req.headers.metaauthtoken;
            try {
                axios
                    .get(
                        `https://mt-client-api-v1.vint-hill.agiliumtrade.ai/users/current/accounts/${accountId}/positions`,
                        {
                            headers: {
                                "auth-token": authtoken,
                            },
                        }
                    )
                    .then(async (response) => {
                        console.log(response.data);
                        for (let i = 0; i < response.data.length; i++) {
                            await Position.findOne({
                                where: { positionId: response.data[i].id },
                            })
                                .then(async (result) => {
                                    // console.log(result[0]?.positionId);
                                    if (result) {
                                        console.log("already exists");
                                    } else {
                                        await Position.create({
                                            userId: req.user.id,
                                            positionId: response.data[i].id,
                                            platform: response.data[i].platform,
                                            type: response.data[i].type,
                                            state: response.data[i].state,
                                            symbol: response.data[i].symbol,
                                            magic: response.data[i].magic,
                                            time: response.data[i].time,
                                            brokerTime:
                                                response.data[i].brokerTime,
                                            openPrice:
                                                response.data[i].openPrice,
                                            volume: response.data[i].volume,
                                            currentVolume:
                                                response.data[i].currentVolume,
                                            reason: response.data[i].reason,
                                            currentPrice:
                                                response.data[i].currentPrice,
                                            accountCurrencyExchangeRate:
                                                response.data[i]
                                                    .accountCurrencyExchangeRate,
                                            brokerComment:
                                                response.data[i].brokerComment,
                                            stopLoss: response.data[i].stopLoss,
                                            takeProfit:
                                                response.data[i].takeProfit,
                                            comment: response.data[i].comment,
                                            clientId: response.data[i].clientId,
                                            updateSequenceNumber:
                                                response.data[i]
                                                    .updateSequenceNumber,
                                        }).catch((err) => {
                                            console.log(err);
                                        });
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                            console.log("success");
                        }
                    });
                res.json({ msg: "success" });
            } catch (error) {
                res.json({ msg: "error", error });
            }
        }
    );
    //get all positions
    app.get(
        "/api/user/positions",
        [passport.authenticate("user_auth")],
        async (req, res) => {
            await Position.findAll()
                .then((position) => {
                    console.log(position);
                    res.json(position);
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    );

    //sync account information
    app.post(
        "/api/user/syncdash",
        [passport.authenticate("user_auth")],
        async (req, res) => {
            const authtoken = req.headers.metaauthtoken;
            const accountId = req.body.accountId;
            try {
                axios
                    .get(
                        `https://mt-client-api-v1.vint-hill.agiliumtrade.ai/users/current/accounts/${accountId}/accountInformation`,
                        {
                            headers: {
                                "auth-token": authtoken,
                            },
                        }
                    )
                    .then(async (response) => {
                        console.log(response.data);
                        await Dashboard.findOne({
                            where: { userId: req.user.id },
                        })
                            .then(async (result) => {
                                if (result) {
                                    await result
                                        .update({
                                            // dash param
                                            broker: response.data.broker,
                                            currency: response.data.currency,
                                            server: response.data.server,
                                            balance: response.data.balance,
                                            equity: response.data.equity,
                                            margin: response.data.margin,
                                            freeMargin:
                                                response.data.freeMargin,
                                            leverage: response.data.leverage,
                                            marginLevel:
                                                response.data.marginLevel,
                                            type: response.data.type,
                                            name: response.data.name,
                                            login: response.data.login,
                                            credit: response.data.credit,
                                            platform: response.data.platform,
                                            marginMode:
                                                response.data.marginMode,
                                            tradeAllowed:
                                                response.data.tradeAllowed,
                                            investorMode:
                                                response.data.investorMode,
                                        })
                                        .then((result) => {
                                            console.log(result);
                                            res.json({ msg: "success" });
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            res.json({ msg: "error", err });
                                        });
                                } else {
                                    await Dashboard.create({
                                        // dash param
                                        userId: req.user.id,
                                        broker: response.data.broker,
                                        currency: response.data.currency,
                                        server: response.data.server,
                                        balance: response.data.balance,
                                        equity: response.data.equity,
                                        margin: response.data.margin,
                                        freeMargin: response.data.freeMargin,
                                        leverage: response.data.leverage,
                                        marginLevel: response.data.marginLevel,
                                        type: response.data.type,
                                        name: response.data.name,
                                        login: response.data.login,
                                        credit: response.data.credit,
                                        platform: response.data.platform,
                                        marginMode: response.data.marginMode,
                                        tradeAllowed:
                                            response.data.tradeAllowed,
                                        investorMode:
                                            response.data.investorMode,
                                    })
                                        .then((result) => {
                                            console.log(result);
                                            res.json({ msg: "success" });
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                                }
                                // res.json(response.data);
                            })
                            .catch((error) => {
                                res.json({ msg: "error", error });
                            });
                    });
            } catch (error) {
                res.json({ msg: "error", error });
            }
        }
    );
};
