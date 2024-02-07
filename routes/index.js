var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.send("My first express app");
});

router.get("/favicon.ico", function (req, res) {
    res.sendStatus(204);
});

module.exports = router;
