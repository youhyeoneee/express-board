const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { verifyToken } = require("../utils/auth");

let Comment = require("../model/Comment");

// id로 조회
router.get("/:id", function (req, res, next) {
    Comment.findById(req.params.id)
        .then((data) => {
            if (!data)
                return res
                    .status(404)
                    .json({ message: "댓글을 찾을 수 없습니다." });
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// 모든 댓글 조회
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
    try {
        const authToken = req.cookies.authToken;
        if (authToken) {
            const decodedToken = verifyToken(authToken);
            const userId = decodedToken._id;

            const commentId = req.params.id;
            req.body.updatedAt = Date.now();
            const updatedData = req.body;

            Comment.findById(commentId).then((data) => {
                if (!data)
                    return res
                        .status(404)
                        .json({ message: "댓글을 찾을 수 없습니다." });

                if (data.author != userId) {
                    return res
                        .status(401)
                        .send("Bad Request: 다른 유저입니다.");
                }

                data.updateOne(updatedData).then((data) => {
                    console.log("update", commentId, updatedData);
                    res.json(data);
                });
            });
        } else {
            res.status(401).send("Bad Request: 로그인이 필요합니다.");
        }
    } catch (err) {
        return next(err);
    }
});

// 삭제
router.delete("/:id", function (req, res, next) {
    const commentId = req.params.id;

    console.log("delete", req.params.id);
    Comment.findByIdAndDelete(commentId)
        .then((data) => {
            if (!data)
                return res
                    .status(404)
                    .json({ message: "댓글을 찾을 수 없습니다." });
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

module.exports = router;
