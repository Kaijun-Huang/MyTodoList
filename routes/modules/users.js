const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const passport = require("passport");
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {});
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      console.log("User already exists");
      res.render("register", {
        name,
        email,
        password,
        confirmPassword,
      });
    } else {
      //if not exists, write in db
      User.create({
        name,
        email,
        password,
      })
        .then(() => res.redirect("/"))
        .catch((err) => console.log(err));

      //   const NewUser = new User({
      //     name,
      //     email,
      //     password,
      //   })
      //     .save()
      //     .then(() => res.redirect("/"))
      //     .catch((err) => console.log(err));
    }
  });
});

module.exports = router;
