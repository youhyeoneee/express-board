const express = require("express");
const router = express.Router();

let Board = require("../model/Board.js");
const Comment = require("../model/Comment.js");

// 조회
router.get("/", function (req, res, next) {
    Board.find()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// id로 조회
router.get("/:id", function (req, res, next) {
    if (req.session.boardPath) {
        req.session.boardPath.push(req.params.id);
    } else {
        req.session.boardPath = [req.params.id];
    }

    console.log("boardPath" + req.session.boardPath);
    Board.findById(req.params.id)
        .then((data) => {
            if (!data)
                return res
                    .status(404)
                    .json({ message: "게시글을 찾을 수 없습니다." });
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// 추가
router.post("/", function (req, res, next) {
    console.log(req.body);
    Board.create(req.body)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// 수정
router.put("/:id", function (req, res, next) {
    const boardId = req.params.id;
    const updatedData = req.body;

    console.log("update", boardId, updatedData);
    Board.findByIdAndUpdate(boardId, updatedData)
        .then((data) => {
            if (!data)
                return res
                    .status(404)
                    .json({ message: "게시글을 찾을 수 없습니다." });

            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// 삭제
router.delete("/:id", function (req, res, next) {
    const boardId = req.params.id;

    console.log("delete", req.params.id);
    Board.findByIdAndDelete(boardId)
        .then((data) => {
            if (!data)
                return res
                    .status(404)
                    .json({ message: "게시글을 찾을 수 없습니다." });

            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// 보드의 댓글들 조회
router.get("/:id/comment", function (req, res, next) {
    const boardId = req.params.id;
    Comment.find({ boardId: boardId })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// 추가
router.post("/:id/comment", function (req, res, next) {
    const boardId = req.params.id;
    Board.findById(boardId).then((data) =>
        Comment.create({
            ...req.body,
            boardId: data._id,
        })
            .then((comment) => {
                res.json(comment);
            })
            .catch((error) => {
                console.error(error);
            })
    );
});
module.exports = router;
