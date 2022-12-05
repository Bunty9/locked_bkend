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
        const email = req.body.email;
        const password = req.body.password;

        await Admin.findOne({ where: { email: email } })
            .then(async (result) => {
                if (!result) {
                    res.json({
                        err: 404,
                        msg: "No admin found with the requested email",
                    });
                } else {
                    const bytes = CryptoJS.AES.decrypt(
                        result.password,
                        process.env.CRYPTO_SECRET
                    );
                    const originalPass = bytes.toString(CryptoJS.enc.Utf8);
                    if (password === originalPass) {
                        const payload = { email: result.email };
                        const token = jwt.sign(payload, process.env.SECRET);
                        res.json({ msg: "admin login success", result, token });
                    } else {
                        res.json({ err: 401, msg: "Wrong password" });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                return;
            });
    });
};
