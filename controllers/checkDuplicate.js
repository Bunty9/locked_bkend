const db = require("../models");

module.exports = {
    checkDuplicate() {
        return async (req, res, next) => {
            const User = db.User;
            await User.findOne({
                where: { email: req.body.email },
            })
                .then((user) => {
                    if (user) {
                        console.log("user with the email already exists");
                        res.status(403).json({
                            errorCode: "403",
                            msg: "user with the email already exists",
                        });
                        return;
                    } else {
                        next();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    return;
                });
        };
    },
    checkAdminDuplicate() {
        return async (req, res, next) => {
            const Admin = db.Admin;
            await Admin.findOne({
                where: { email: req.body.email },
            })
                .then((user) => {
                    if (user) {
                        console.log("user with the email already exists");
                        res.status(403).json({
                            errorCode: "403",
                            msg: "user with the email already exists",
                        });
                        return;
                    } else {
                        next();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    return;
                });
        };
    },
    async checkDuplicatePosition(positionId) {
        const Position = db.Position;
        await Position.findOne({
            where: { positionId: positionId },
        })
            .then((result) => {
                if (result) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch((err) => {
                console.log(err);
                return;
            });
    },
    async checkDuplicateOrder(orderId) {
        console.log(orderId);
        const Order = db.Order;
        await Order.findAll({
            where: { orderId: orderId },
        })
            .then((result) => {
                if (result) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch((err) => {
                console.log(err);
                return;
            });
    },
};
