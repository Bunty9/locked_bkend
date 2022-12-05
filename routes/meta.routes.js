let MetaApi = require("metaapi.cloud-sdk").default;

let token =
    "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI5MTcyNzIxMTc5NWEzMzFhMTRiZWZlZDM5MjE5YTE3MCIsInBlcm1pc3Npb25zIjpbXSwidG9rZW5JZCI6IjIwMjEwMjEzIiwiaWF0IjoxNjY5ODc1Njk3LCJyZWFsVXNlcklkIjoiOTE3MjcyMTE3OTVhMzMxYTE0YmVmZWQzOTIxOWExNzAifQ.cRNhNM5yu6IEawF8J853_7iuLxiSFnaYSiPVbOf3ZoXCu-F4LstB78We8OE_SkFK__PW-pmiC_kJXGibMSWqu-0OU_xVYg7yndyvCi85mr6s8sKBvPHoLJFQQxNtaxZPg2MegnhFP7xMsgkMpB9OLirTne-uyy15x1kkOPZe7CD4SuRKIcuuaa3XB9dK0o2cjw2mw_6vD49V_t-Mn54eIMxaPmQXXh0FS7GztPkgY5EuFmYZ0thIH32hhIOnGdPngmHijkpxEYOHRl0HgtJTZBvpzl-hSyY3BR80FgSkqWZhAPwg5Yb-4t6HsVG9So7xnx4Oj9FuFrUPnEnaXplHXpOpRLvPuBgnIttEP1gD8HSUoBrHI0NxTW6DrWBb-dU0v08J27W3efbwOvl_02GJ0rKbBbXmQ6fNRFLAcymzfoPaYBARXaZNR5R33uA-Pc23Pq8hXdhFliMkRg3N6PivJhgFCuwQXb9Lj0Rra4AuuOst93b8N-ScVhujHUX2hJYAc1cfHIfElBnywQQm60psIDy889y1P2rO24f2A9OLUdBU1qPhUTbOUf_4NQh-I6nDGutcfPpD-FnNc5VFLy_6RvulIPV2AsEcY6w7tKB4XfgjnQiX6YnapRefGzt1M0-kb6Dcjcyd3DwcBdk9yT8SOoes47oP9vcpMIKZi-EmlYI";
let login = "5008274971";
let password = "narjdn8u";
let serverName = "MetaQuotes-Demo";

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
};

//history orders
