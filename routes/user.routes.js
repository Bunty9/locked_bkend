const db = require("../models");

module.exports = function (app, sequelize) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    const User = db.User;

    app.post("/api/auth/signup", async (req, res) => {
        console.log(req.body);
        const email = req.body.email;
        const username = req.body.username;
        const phone = req.body.phone;
        const address = req.body.address;
        const password = req.body.password;

        await User.create({
            username: username,
            email: email,
            password: password,
            phone: phone,
            address: address,
        })
            .then(async (result) => {
                console.log(result);
                res.status(200).send({ result });
            })
            .catch((err) => {
                console.log(err);
                return;
            });
    });

    app.post("/api/auth/signin", async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        await User.findOne({ where: { username: username } })
            .then(async (result) => {
                if (!result) {
                    res.json({
                        err: 404,
                        msg: "No user found with the requested username",
                    });
                } else {
                    if (result.password === password) {
                        res.json({ msg: "login success" });
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

        async (req, res) => {
            await User.findAll()
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
