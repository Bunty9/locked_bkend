const db = require("../models");
const Dashboard = db.Dashboard;

module.exports = function (app, passport) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get(
        "/api/user/getdashboard",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            await Dashboard.findAll({ where: { userId: req.user.id } })
                .then((result) => {
                    res.json({ data: result });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ msg: ">> Error while compiling data: ", err });
                });
        }
    );
};
