const express = require("express");
const app = express();
const session = require("express-session");
const routes = require("./routes"); //載入router
require("./config/mongoose"); //Mongoose 連線設定只需要「被執行」，不需要接到任何回傳參數繼續利用，所以這裡不需要再設定變數。
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const usePassport = require("./config/passport");

const exphbs = require("express-handlebars");
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

app.use(
  session({
    secret: "ThisIsMySecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes); //使用route module
usePassport(app);

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
