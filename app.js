const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const boardRouter = require("./routes/board");
const birdsRouter = require("./routes/birds");
const commentRouter = require("./routes/comment");
const movieRouter = require("./routes/movie");
const todoRouter = require("./routes/todo");

dotenv.config();
const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "<my-secret>",
        resave: true,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    })
);

// 위치 중요 next 꼭 하기
app.use(function (req, res, next) {
    if (req.path != "/favicon.ico") {
        if (req.session.trackingUser) {
            req.session.trackingUser.push(req.path);
        } else {
            req.session.trackingUser = [req.path];
        }
    }

    console.log("trackingUser : ", req.session.trackingUser);

    next();
});

app.use("/", indexRouter);
app.use("/api", usersRouter);
app.use("/api/board", boardRouter);
app.use("/birds", birdsRouter);
app.use("/api/comment", commentRouter);
app.use("/movie", movieRouter);
app.use("/todo", todoRouter);

app.get("/sample", function (req, res) {
    res.send("Sample");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    console.log(err);
    // render the error page
    // res.status(err.status || 500);
    // res.render("error");
});

dotenv.config();

const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const cluster = process.env.CLUSTER;
const database = "test";
const MONGO_URL = `mongodb+srv://${username}:${password}@${cluster}/${database}`;

mongoose
    .connect(MONGO_URL, {
        retryWrites: true,
        w: "majority",
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then((resp) => {
        // console.log(resp);
        console.log("SUCCESS CONNECTION");
    })
    .catch((err) => console.log(err));

module.exports = app;
