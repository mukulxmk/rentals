const express = require("express");
const path = require('path')
const router = express.Router();
const Login = require('../controllers/auth/login.js');
const SignUp = require('../controllers/auth/signup.js');
const Logout = require('../\/controllers/auth/logout.js');
const editProfile = require('../\/controllers/user/editProfile.js');
const { isLoggedIn } = require('../middlewares/middleware.js')

router.post("/signup", SignUp);

router.post("/login", Login);

router.get("/logout", Logout);

router.patch("/profile", isLoggedIn, editProfile);

router.get("/current_user", isLoggedIn, (req, res) => {

    res.json(req.user || null);
});

module.exports = router;