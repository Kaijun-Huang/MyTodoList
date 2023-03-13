const express = require("express");
const router = express.Router();
const Todo = require("../../models/todo");

//--------------------------------route

//create, 顯示new page
router.get("/new", (req, res) => {
  return res.render("new");
});

//create
router.post("/", (req, res) => {
  const name = req.body.name;
  return Todo.create({ name })
    .then(() => res.redirect("/"))
    .catch((error) => console.log("error"));
  // return Todo.create({ name })
  //   .then(() => res.redirect("/"))
  //   .catch((error) => console.error("error"));
});

//read 瀏覽特定todo
router.get("/:id", (req, res) => {
  //detail page
  const id = req.params.id;
  Todo.findById(id)
    .lean()
    .then((todo) => res.render("detail", { todo }))
    .catch((error) => console.log("error"));
});

// update, 修改特定todo, 按edit導到edit畫面, 並帶上name在輸入框
router.get("/:id/edit", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id) //在Todo裡找這個id的那筆資料, 給edit頁面render, 用todo.name取用
    .lean()
    .then((todo) => res.render("edit", { todo }))
    .catch((error) => console.log(error));
});

//update, 修改特定todo
router.put("/:id", (req, res) => {
  const id = req.params.id; //id, name都來自客戶端(req)
  // const name = req.body.name; //使用者送進來的name
  const { name, isDone } = req.body; //解構賦值法
  return Todo.findById(id)
    .then((todo) => {
      todo.name = name; //把資料庫的name賦值成使用者送進來的name
      todo.isDone = isDone === "on"; //先執行isDone === 'on' 為true
      return todo.save(); //要return出來才能繼續接then, 如果是非同步的事情, 我們盡量把事件return出來
    })
    .then(() => res.redirect(`/todos/${id}`)) //導到detail page
    .catch((error) => console.log(error));
});

//delete
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .then((todo) => todo.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

module.exports = router;
