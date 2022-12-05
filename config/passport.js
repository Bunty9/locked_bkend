const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

module.exports = function (passport) {
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromHeader("authorization"),
        secretOrKey: process.env.SECRET,
    };
    const db = require("../models");
    const User = db.User;
    const Admin = db.Admin;
    passport.use(
        "user_auth",
        new JwtStrategy(jwtOptions, async (payload, done) => {
            await User.findOne({
                where: { email: payload.email },
            })
                .then((user) => {
                    if (user) {
                        // console.log(user);
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        })
    );
    passport.use(
        "admin_auth",
        new JwtStrategy(jwtOptions, async (payload, done) => {
            await Admin.findOne({
                where: { email: payload.email },
            })
                .then((user) => {
                    if (user) {
                        // console.log(user);
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        return done(null, id);
    });
};
