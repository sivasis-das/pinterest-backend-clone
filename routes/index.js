var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const localStrategy = require("passport-local");
const upload = require("./multer");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
  console.log(req.session.passport);
  //when we login our username is stored in the passport session with key user
  const userdata = await userModel.findOne({
    username: req.session.passport.user,
  }).populate("posts");
  console.log(userdata);
  res.render("profile", {
    userdata: userdata,
  });
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

router.get("/login", (req, res) => {
  // to show error while loging in
  const error = req.flash("error");
  console.log(error);
  res.render("login", { error: error });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

router.get("/feeds", (req, res) => {
  res.render("feeds");
});

router.post("/upload", isLoggedIn, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  }
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    image: req.file.filename,
    postText: req.body.filecaption,
    user: user._id,
  });
  await user.posts.push(post._id);
  await user.save().then(success=>console.log("done",success)).catch(err=>console.log("Not Done",err))
  res.redirect("/profile");
});

module.exports = router;
