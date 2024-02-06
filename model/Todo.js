const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    content: { type: String, required: true },
    color: { type: String, default: "white" },
    createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
