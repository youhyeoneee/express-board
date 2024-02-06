const express = require("express");
const router = express.Router();

const Todo = require("../model/Todo.js");

// 조회
router.get("/", function (req, res, next) {
    const search = req.query.search;

    if (search) {
        console.log("검색", search);

        const regex = (pattern) => new RegExp(`.*${pattern}.*`);
        const searchRegex = regex(search); // .*{search}.*

        Todo.find({
            $or: [{ content: { $regex: searchRegex } }],
        })
            .then((data) => {
                if (!data)
                    return res
                        .status(404)
                        .json({ message: "투두를 찾을 수 없습니다." });
                res.json(data);
            })
            .catch((err) => {
                return next(err);
            });
    } else {
        console.log("전체 조회");
        Todo.find()
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                return next(err);
            });
    }
});

// id로 조회
router.get("/:id", function (req, res, next) {
    Todo.findById(req.params.id)
        .then((data) => {
            if (!data)
                return res
                    .status(404)
                    .json({ message: "투두를 찾을 수 없습니다." });
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// 추가
router.post("/", function (req, res, next) {
    console.log(req.body);
    Todo.create(req.body)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// 수정
router.put("/:id", function (req, res, next) {
    const id = req.params.id;
    const updatedData = req.body;

    Todo.findByIdAndUpdate(id, updatedData)
        .then((data) => {
            if (!data)
                return res
                    .status(404)
                    .json({ message: "투두를 찾을 수 없습니다." });

            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

// 삭제
router.delete("/:id", function (req, res, next) {
    const id = req.params.id;

    console.log("delete", id);
    Todo.findByIdAndDelete(id)
        .then((data) => {
            if (!data)
                return res
                    .status(404)
                    .json({ message: "투두를 찾을 수 없습니다." });

            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

module.exports = router;
