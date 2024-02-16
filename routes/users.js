var express = require("express");
const User = require("../model/User");
const { createToken, verifyToken } = require("../utils/auth");
const { head } = require("../app");
var router = express.Router();

/* GET users listing. */
router.get("/user", function (req, res, next) {
    User.find()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

router.get("/user/:id", function (req, res, next) {
    User.findById(req.params.id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

router.post("/signup", async (req, res, next) => {
    try {
        const { email, nickname, password } = req.body;
        console.log(req.body);
        const user = await User.signUp(email, nickname, password);
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(400);
        next(err);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        const user = await User.login(email, password);
        const tokenMaxAge = 60 * 60 * 24 * 3;
        const token = createToken(user, tokenMaxAge);

        user.token = token;

        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: tokenMaxAge * 1000,
        });

        console.log(user);
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(400);
        next(err);
    }
});

router.all("/logout", async (req, res, next) => {
    try {
        let token;
        if (req.body.password) {
            const { email, password } = req.body;
            const user = await User.login(email, password);
            const tokenMaxAge = 60 * 60 * 24 * 3;
            token = createToken(user, tokenMaxAge);

            user.token = token;
        } else if (req.body.token) {
            token = req.body.token;
        }

        res.cookie("authToken", token, {
            httpOnly: true,
            expires: new Date(Date.now()),
        });

        res.json({ message: "로그아웃 완료" });
    } catch (err) {
        console.log(err);
        res.status(400);
        next(err);
    }
});

router.get("/protected", authenticate, async (req, res, next) => {
    console.log(req.user);
    res.json({ data: "민감한 데이터" });
});

async function authenticate(req, res, next) {
    let token = req.cookies.authToken;
    let headerToken = req.headers.authorization;
    if (!token && headerToken) {
        token = headerToken.split(" ")[1];
    }

    const user = verifyToken(token);
    req.user = user;

    if (!user) {
        const error = new Error("Authorization Failed");
        error.status = 403;

        next(error);
    }
    next();
}
module.exports = router;
