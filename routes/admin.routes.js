const db = require("../models");
const CryptoJS = require("crypto-js");
const { checkAdminDuplicate } = require("../controllers/checkDuplicate");
const jwt = require("jsonwebtoken");

module.exports = function (app, passport) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    const Admin = db.Admin;
    const User = db.User;
    const Dashboard = db.Dashboard;
    const Withdraw = db.Withdraw;
    const Contact = db.Contact;
    const Position = db.Position;
    const Order = db.Order;
    const MetaTrader = db.MetaTrader;

    app.post(
        "/api/auth/admin/signup",
        [checkAdminDuplicate()],
        async (req, res) => {
            console.log(req.body);
            const email = req.body.email;
            const username = req.body.username;

            const hashedPass = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.CRYPTO_SECRET
            ).toString();

            await Admin.create({
                username: username,
                email: email,
                password: hashedPass,
            })
                .then(async (result) => {
                    const payload = { email: result.email };
                    const token = jwt.sign(payload, process.env.SECRET);
                    res.json({ msg: "admin login success", result, token });
                })
                .catch((err) => {
                    console.log(err);
                    return;
                });
        }
    );

    app.post("/api/auth/admin/signin", async (req, res) => {
        const password = req.body.password;

        await Admin.findOne({ where: { email: req.body.email } })
            .then((result) => {
                if (result) {
                    const bytes = CryptoJS.AES.decrypt(
                        result.password,
                        process.env.CRYPTO_SECRET
                    );
                    const originalPass = bytes.toString(CryptoJS.enc.Utf8);
                    if (password === originalPass) {
                        const payload = { email: result.email };
                        const token = jwt.sign(payload, process.env.SECRET);
                        res.json({
                            msg: "admin login success",
                            email: result.email,
                            token,
                        });
                    } else {
                        res.json({ err: 401, msg: "Wrong password" });
                    }
                } else {
                    res.json({
                        err: 404,
                        msg: "No admin found with the requested email",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    err: 500,
                    msg: ">> Error while compiling data: ",
                    err,
                });
            });
    });

    //get user details
    app.get(
        "/api/admin/getallusers",
        [passport.authenticate("admin_auth", { session: false })],
        async (req, res) => {
            await User.findAll({
                include: [
                    {
                        model: Dashboard,
                        as: "dashboards",
                    },
                    {
                        model: Withdraw,
                        as: "withdraws",
                    },
                    {
                        model: Position,
                        as: "positions",
                    },
                    {
                        model: Order,
                        as: "orders",
                    },
                    {
                        model: MetaTrader,
                        as: "metatrader",
                    },
                ],
            })
                .then((result) => {
                    res.json({ data: result });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ msg: ">> Error while compiling data: ", err });
                });
        }
    );

    //get all contact messages
    app.post(
        "/api/admin/contact/getall",
        [passport.authenticate("admin_auth", { session: false })],
        async (req, res) => {
            await Contact.findAll({
                include: [
                    {
                        model: User,
                        as: "user",
                    },
                ],
            })
                .then((result) => {
                    res.json({ data: result });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ msg: ">> Error while compiling data: ", err });
                });
        }
    );

    //create
    app.post(
        "/api/admin/user/mtdetail/create",
        [passport.authenticate("admin_auth", { session: false })],
        async (req, res) => {
            await MetaTrader.create({
                userId: req.body.userId,
                serverId: req.body.serverId,
                serverPassword: req.body.serverPassword,
                serverName: req.body.serverName,
            })
                .then(() => {
                    res.json({ msg: "MT5 data added successfully" });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ msg: ">> Error while updating data: ", err });
                });
        }
    );
    //update
    app.post(
        "/api/admin/user/mtdetail/update",
        [passport.authenticate("admin_auth", { session: false })],
        async (req, res) => {
            await MetaTrader.update(
                {
                    serverId: req.body.serverId,
                    serverPassword: req.body.serverPassword,
                    serverName: req.body.serverName,
                },
                {
                    where: { userId: req.body.userId },
                }
            )
                .then(() => {
                    res.json({ msg: "MT5 data updated successfully" });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ msg: ">> Error while updating data: ", err });
                });
        }
    );
    //delete
    app.post(
        "/api/admin/user/mtdetail/delete",
        [passport.authenticate("admin_auth", { session: false })],
        async (req, res) => {
            await MetaTrader.destroy({ where: { userId: req.body.userId } })
                .then(() => {
                    res.json({ msg: "MT5 data deleted successfully" });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ msg: ">> Error while updating data: ", err });
                });
        }
    );
};
