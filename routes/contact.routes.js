const db = require("../models");
const Contact = db.Contact;
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //add contact message
    app.post("/api/contact/add", async (req, res) => {
        await Contact.create({
            userId: req.body.userId,
            issue: req.body.issue,
            message: req.body.message,
        })
            .then((result) => {
                res.json({ msg: "Contact message saved", result });
            })
            .catch((err) => {
                console.log(err);
                res.json({ msg: ">> Error while saving data: ", err });
            });
    });

    //get all contact messages
    app.post("/api/contact/all", async (req, res) => {
        await Contact.findAll({ where: { userId: req.body.userId } })
            .then((result) => {
                res.json({ data: result });
            })
            .catch((err) => {
                console.log(err);
                res.json({ msg: ">> Error while compiling data: ", err });
            });
    });
};
