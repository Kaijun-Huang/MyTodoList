const express = require("express");
const router = express.Router();
const Todo = require("../../models/todo");

router.get("/", (req, res) => {
  Todo.find()
    .lean()
    .sort({ _id: "asc" }) // 新增這裡：根據 _id 升冪排序
    .then((todos) => res.render("index", { todos }))
    .catch((error) => console.error(error));
});

module.exports = router;
