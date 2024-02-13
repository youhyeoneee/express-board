const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
