const mongoose = require('mongoose');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function Login(req, res){
    try {
        if(!req.body.email || !req.body.password) return res.status(400).json({ error: "Credentials for login are required/missing. "})
        const { email, password } = req.body;

        const user = await User.findOne( { email : email});
        
        if(!user) return res.status(404).json({ error: "User not registered."});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({ error: "Incorrect Password Entered."});

        if(user.banned) return res.status(403).json({ error: "User is marked Banned."})

        const token = jwt.sign(
            { userId: user._id ,  role: user.role, email: user.email },
            process.env.JWT_SECRET, 
            { expiresIn : '3d'}
        )

        user.loginStamps.push(Date.now());
        await user.save();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ,
            sameSite:  process.env.NODE_ENV === "production" ? "none" : "lax" ,
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login Succesfull.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profile: user.profile
            }
        })

    } catch (err) {
        console.error("In Login ", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err
        })
    }
}

module.exports = Login;