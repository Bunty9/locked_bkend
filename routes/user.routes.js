const db = require("../models");
const CryptoJS = require("crypto-js");
const { checkDuplicate } = require("../controllers/checkDuplicate");
const jwt = require("jsonwebtoken");

module.exports = function (app, passport) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    const User = db.User;

    app.post("/api/auth/signup", [checkDuplicate()], async (req, res) => {
        console.log(req.body);
        const email = req.body.email;
        const username = req.body.username;
        const phone = req.body.phone;
        const address = req.body.address;

        const hashedPass = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.CRYPTO_SECRET
        ).toString();

        await User.create({
            username: username,
            email: email,
            password: hashedPass,
            phone: phone,
            address: address,
        })
            .then(async (result) => {
                const payload = { email: result.email };
                const token = jwt.sign(payload, process.env.SECRET);
                console.log(result);
                res.json({ msg: "login success", result, token });
            })
            .catch((err) => {
                console.log(err);
                return;
            });
    });
    //update user
    app.put(
        "/api/users/update",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            const id = req.user.id;
            const username = req.body.username;
            const phone = req.body.phone;
            const address = req.body.address;
            await User.update(
                {
                    username: username,
                    phone: phone,
                    address: address,
                },
                { where: { id: id } }
            )
                .then(() => {
                    res.json({ msg: "User updated successfully" });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ msg: ">> Error while updating data: ", err });
                });
        }
    );
    app.post("/api/auth/signin", async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        await User.findOne({ where: { email: email } })
            .then(async (result) => {
                if (!result) {
                    res.json({
                        err: 404,
                        msg: "No user found with the requested email",
                    });
                } else {
                    const bytes = CryptoJS.AES.decrypt(
                        result.password,
                        process.env.CRYPTO_SECRET
                    );
                    const resultPassword = bytes.toString(CryptoJS.enc.Utf8);
                    if (resultPassword === password) {
                        const payload = { email: result.email };
                        const token = jwt.sign(payload, process.env.SECRET);
                        res.json({
                            msg: "login success",
                            result,
                            token: token,
                        });
                    } else {
                        res.status(401).json({
                            msg: "Password did not match",
                        });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                res.json({ msg: ">> Error while finding data: ", err });
            });
    });

    app.get(
        "/api/users/all",
        [passport.authenticate("admin_auth", { session: false })],
        async (req, res) => {
            await User.findAll({ attributes: { exclude: ["password"] } })
                .then((result) => {
                    res.json({ data: result });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ msg: ">> Error while compiling data: ", err });
                });
        }
    );

    //save Meta account Id
    app.post(
        "/api/users/meta/accountid",
        [passport.authenticate("user_auth", { session: false })],
        async (req, res) => {
            await User.update(
                { accountId: req.body.accountId },
                { where: { id: req.user.id } }
            )
                .then(() => {
                    res.json({ msg: "Meta account Id saved" });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ msg: ">> Error while saving data: ", err });
                });
        }
    );
};
