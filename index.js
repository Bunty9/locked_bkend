"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
const passport = require("passport");
var session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
// Routes and middleware
// app.use(/* ... */)
// app.get(/* ... */)

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(cors());
// app.use(cookieParser());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//session
app.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
    })
);
//helmet
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

//passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

//sequilize
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
        ssl: {
            require: false,
            rejectUnauthorized: false,
        },
    },
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
connectDB();

app.get("/", function (req, res, next) {
    res.json({ msg: "API Working" });
});
require("./routes/user.routes")(app, passport);
require("./routes/admin.routes")(app, passport);
require("./routes/dashboard.routes")(app, passport);
require("./routes/meta.routes")(app, passport);
require("./routes/withdraw.routes")(app, passport);
require("./routes/contact.routes")(app, passport);
require("./routes/chart.routes")(app, passport);

// Error handlers
app.use(function fourOhFourHandler(req, res) {
    res.status(404).json("404");
});
app.use(function fiveHundredHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json("500");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
