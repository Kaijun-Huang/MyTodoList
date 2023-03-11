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
    .then((todos) => res.render("index", { todos: todos }))
    .catch((error) => console.error(error));
});

app.get("/todos/new", (req, res) => {
  return res.render("new");
});
app.post("/todos", (req, res) => {
  const name = req.body.name;
  return Todo.create({ name })
    .then(() => res.redirect("/"))
    .catch((error) => console.log("error"));
  // return Todo.create({ name })
  //   .then(() => res.redirect("/"))
  //   .catch((error) => console.error("error"));
});
app.listen(3000, () => {
  console.log("App is running on port 3000");
});
