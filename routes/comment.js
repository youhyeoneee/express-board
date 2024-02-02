const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

let Comment = require("../model/Comment");

// 추가
router.post("/", function (req, res, next) {
    console.log(req.body);
    Comment.create(req.body)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// id로 조회
router.get("/:id", function (req, res, next) {
    Comment.findById(req.params.id)
        .then((data) => {
            // if (!data) return next(err);
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// 조회
router.get("/", function (req, res, next) {
    Comment.find()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// 수정
router.put("/:id", function (req, res, next) {
    const commentId = req.params.id;
    const updatedData = req.body;

    console.log("update", commentId, updatedData);
    Comment.findByIdAndUpdate(commentId, updatedData)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// 삭제
router.delete("/:id", function (req, res, next) {
    const commentId = req.params.id;

    console.log("delete", req.params.id);
    Comment.findByIdAndDelete(commentId)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

module.exports = router;
