const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Todo = require("./models/todo");
const bodyParser = require("body-parser");
const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error!");
});
db.once("open", () => {
  console.log("mongdb connected!");
});
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const exphbs = require("express-handlebars");
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  Todo.find()
    .lean()
    .then((todos) => res.render("index", { todos }))
    .catch((error) => console.error(error));
});

app.get("/todos/new", (req, res) => {
  return res.render("new");
});

//create
app.post("/todos", (req, res) => {
  const name = req.body.name;
  return Todo.create({ name })
    .then(() => res.redirect("/"))
    .catch((error) => console.log("error"));
  // return Todo.create({ name })
  //   .then(() => res.redirect("/"))
  //   .catch((error) => console.error("error"));
});

//read
app.get("/todos/:id", (req, res) => {
  //detail page
  const id = req.params.id;
  Todo.findById(id)
    .lean()
    .then((todo) => res.render("detail", { todo }))
    .catch((error) => console.log("error"));
});

//按edit導到edit畫面, 並帶上name在輸入框
app.get("/todos/:id/edit", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id) //在Todo裡找這個id的那筆資料, 給edit頁面render, 用todo.name取用
    .lean()
    .then((todo) => res.render("edit", { todo }))
    .catch((error) => console.log(error));
});

//Update
app.post("/todos/:id/edit", (req, res) => {
  const id = req.params.id;
  const name = req.body.name; //使用者送進來的name
  return Todo.findById(id)
    .then((todo) => {
      todo.name = name; //把資料庫的name賦值成使用者送進來的name
      return todo.save(); //要return出來才能繼續接then, 如果是非同步的事情, 我們盡量把事件return出來
    })
    .then(() => res.redirect(`/todos/${id}`)) //導到detail page
    .catch((error) => console.log(error));
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
