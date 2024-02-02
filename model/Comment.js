const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    boardId: { type: String, required: true },
    content: { type: String, required: true },
    author: String,
    createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
