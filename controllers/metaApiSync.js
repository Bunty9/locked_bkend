let MetaApi = require("metaapi.cloud-sdk").default;
let login = "5008274971";

module.exports = {
    async testMetaApiSynchronization(token, userId) {
        const api = new MetaApi(token);
        try {
            let accounts = await api.metatraderAccountApi.getAccounts();
            let account = accounts.find((a) => a.login === login);
            const initialState = account.state;
            const deployedStates = ["DEPLOYING", "DEPLOYED"];
            if (!deployedStates.includes(initialState)) {
                // wait until account is deployed and connected to broker
                console.log("Deploying account");
                await account.deploy();
            }
            console.log(
                "Waiting for API server to connect to broker (may take couple of minutes)"
            );
            await account.waitConnected();

            // connect to MetaApi API
            let connection = account.getRPCConnection();
            await connection.connect();

            // wait until terminal state synchronized to the local state
            console.log(
                "Waiting for SDK to synchronize to terminal state (may take some time depending on your history size)"
            );
            await connection.waitSynchronized();

            // invoke RPC API (replace ticket numbers with actual ticket numbers which exist in your MT account)
            console.log("Testing MetaAPI RPC API");
            const acc = await connection.getAccountInformation();
            // const positions = await connection.getPositions();
            // const orders = await connection.getOrders();
            // const threemonthsorders =
            //     await connection.getHistoryOrdersByTimeRange(
            //         new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            //         new Date()
            //     );
            // const threemonthsdeals = await connection.getDealsByTimeRange(
            //     new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            //     new Date()
            // );
            // const servertime = await connection.getServerTime();
            console.log("Closing Connection");
            await connection.close();
            return {
                acc,
                // positions,
                // orders,
                // threemonthsorders,
                // threemonthsdeals,
                // servertime,
            };
        } catch (error) {
            console.log(error);
        }
    },
};
