var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/profile",isLoggedIn, function (req, res, next) {
  res.render("profile");
});

router.post("/register", (req, res) => {
  const { username, fullname, email } = req.body;
  const userDate = new userModel({ username, fullname, email });

  userModel.register(userDate, req.body.password).then((registereduser) => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});

router.get("/login",(req,res)=>{
  res.render("login")
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login")
}

router.get("/feeds",(req,res)=>{
  res.render("feeds")
})

module.exports = router;
