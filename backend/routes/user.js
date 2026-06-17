const express = require("express");
const router = express.Router();
const Login = require('../controllers/auth/login.js');
const SignUp = require('../controllers/auth/signup.js');
const Logout = require('../\/controllers/auth/logout.js');

router.post("/signup", SignUp);

router.post("/login", Login);

router.get("/logout", Logout);


router.get("/current_user", (req, res) => {

    res.json(req.user || null);
});

module.exports = router;