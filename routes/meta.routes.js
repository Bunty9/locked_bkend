let MetaApi = require("metaapi.cloud-sdk").default;
const axios = require("axios").default;
let token =
    "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI5MTcyNzIxMTc5NWEzMzFhMTRiZWZlZDM5MjE5YTE3MCIsInBlcm1pc3Npb25zIjpbXSwidG9rZW5JZCI6IjIwMjEwMjEzIiwiaWF0IjoxNjY5ODc1Njk3LCJyZWFsVXNlcklkIjoiOTE3MjcyMTE3OTVhMzMxYTE0YmVmZWQzOTIxOWExNzAifQ.cRNhNM5yu6IEawF8J853_7iuLxiSFnaYSiPVbOf3ZoXCu-F4LstB78We8OE_SkFK__PW-pmiC_kJXGibMSWqu-0OU_xVYg7yndyvCi85mr6s8sKBvPHoLJFQQxNtaxZPg2MegnhFP7xMsgkMpB9OLirTne-uyy15x1kkOPZe7CD4SuRKIcuuaa3XB9dK0o2cjw2mw_6vD49V_t-Mn54eIMxaPmQXXh0FS7GztPkgY5EuFmYZ0thIH32hhIOnGdPngmHijkpxEYOHRl0HgtJTZBvpzl-hSyY3BR80FgSkqWZhAPwg5Yb-4t6HsVG9So7xnx4Oj9FuFrUPnEnaXplHXpOpRLvPuBgnIttEP1gD8HSUoBrHI0NxTW6DrWBb-dU0v08J27W3efbwOvl_02GJ0rKbBbXmQ6fNRFLAcymzfoPaYBARXaZNR5R33uA-Pc23Pq8hXdhFliMkRg3N6PivJhgFCuwQXb9Lj0Rra4AuuOst93b8N-ScVhujHUX2hJYAc1cfHIfElBnywQQm60psIDy889y1P2rO24f2A9OLUdBU1qPhUTbOUf_4NQh-I6nDGutcfPpD-FnNc5VFLy_6RvulIPV2AsEcY6w7tKB4XfgjnQiX6YnapRefGzt1M0-kb6Dcjcyd3DwcBdk9yT8SOoes47oP9vcpMIKZi-EmlYI";
let login = "5008274971";
let password = "narjdn8u";
let serverName = "MetaQuotes-Demo";
const db = require("../models");
const Order = db.Order;
const Position = db.Position;
const Dashboard = db.Dashboard;
const { checkDuplicateOrder } = require("../controllers/checkDuplicate");
const api = new MetaApi(token);

module.exports = function (app, passport) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get(
        "/api/meta/acc",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            try {
                let accounts = await api.metatraderAccountApi.getAccounts();
                let account = accounts.find(
                    (a) => a.login === login && a.type.startsWith("cloud")
                );
                await account.waitConnected();
                let connection = account.getStreamingConnection();
                console.log(connection.host);
                await connection.connect();
                await connection.waitSynchronized();
                let terminalState = connection.terminalState;
                let acc = terminalState.accountInformation;
                let positions = terminalState.positions;
                let orders = terminalState.orders;
                let historyStorage = terminalState.historyStorage;
                let deals = historyStorage.deals;
                let historyOrders = historyStorage.historyOrders;
                await connection.close();
                res.json({
                    "account information": acc,
                    positions: positions,
                    orders: orders,
                    deals: deals,
                    "history orders": historyOrders,
                });
            } catch (error) {
                res.json({ msg: "error", error });
            }
        }
    );
    app.get(
        "/api/meta/pos",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            try {
                let accounts = await api.metatraderAccountApi.getAccounts();
                let account = accounts.find(
                    (a) => a.login === login && a.type.startsWith("cloud")
                );
                await account.waitConnected();
                let connection = account.getStreamingConnection();
                await connection.connect();
                await connection.waitSynchronized();
                let terminalState = connection.terminalState;
                let positions = terminalState.positions;
                await connection.close();
                res.json({ msg: "terminal data", positions });
            } catch (error) {
                res.json({ msg: "error", error });
            }
        }
    );
    app.get(
        "/api/meta/orders",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            try {
                let accounts = await api.metatraderAccountApi.getAccounts();
                let account = accounts.find(
                    (a) => a.login === login && a.type.startsWith("cloud")
                );
                await account.waitConnected();
                let connection = account.getStreamingConnection();
                await connection.connect();
                await connection.waitSynchronized();
                let terminalState = connection.terminalState;
                let orders = terminalState.orders;
                await connection.close();
                res.json({ msg: "terminal data", orders });
            } catch (error) {
                res.json({ msg: "error", error });
            }
        }
    );

    app.get(
        "/api/meta/margin",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            try {
                let accounts = await api.metatraderAccountApi.getAccounts();
                let account = accounts.find(
                    (a) => a.login === login && a.type.startsWith("cloud")
                );
                await account.waitConnected();
                let connection = account.getStreamingConnection();
                await connection.connect();
                await connection.waitSynchronized();
                const margin = await connection.calculateMargin({
                    symbol: "GBPUSD",
                    type: "ORDER_TYPE_BUY",
                    volume: 0.1,
                    openPrice: 1.1,
                });
                await connection.close();
                res.json({ msg: "terminal data", margin });
            } catch (error) {
                res.json({ msg: "error", error });
            }
        }
    );

    app.get(
        "/api/meta/history",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            try {
                let accounts = await api.metatraderAccountApi.getAccounts();
                let account = accounts.find(
                    (a) => a.login === login && a.type.startsWith("cloud")
                );
                await account.waitConnected();
                let connection = account.getStreamingConnection();
                await connection.connect();
                await connection.waitSynchronized();
                const historyStorage = connection.historyStorage;
                const history = historyStorage.historyOrders.slice(-5);
                await connection.close();
                console.log(history);
                res.json({ msg: "terminal data", history });
            } catch (error) {
                res.json({ msg: "error", error });
            }
        }
    );

    //history orders
    // axios send request to meta api
    // result loop
    //checkDuplicateOrder
    //if true next() else create new order
    // https://mt-client-api-v1.vint-hill.agiliumtrade.ai/users/current/accounts/d50437f9-2bdb-48ff-9413-0d347c7fc443/orders

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
                            await Position.findAll({
                                where: { positionId: response.data[i].id },
                            })
                                .then(async (result) => {
                                    console.log(result[0]?.positionId);
                                    if (
                                        result[0]?.positionId ===
                                        response.data[i].id
                                    ) {
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
