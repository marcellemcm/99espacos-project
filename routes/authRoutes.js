const express = require("express");
const router = express.Router();

const passport = require("passport");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { firstname, lastname, email, username, password, role } = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Indique um nome de usuário e uma senha"
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", { message: "Este usuário já existe" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        firstname,
        lastname,
        email,
        username,
        password: hashPass,
        role
      });

      newUser.save(err => {
        if (err) {
          res.render("auth/signup", { message: "Verfique seus dados" });
        } else {
          res.redirect("/area");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/area",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
