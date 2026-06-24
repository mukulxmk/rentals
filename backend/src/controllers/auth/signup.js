const mongoose = require('mongoose');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function SignUp(req, res){
    try {
        if(!req.body) return res.status(400).json({ error: "Credentials for signup are required/missing. "})
        const { username, email, password } = req.body;

        const existingUser = await User.findOne( { email : email})
        if(existingUser) return res.status(404).json({ error: "User already exists try Logging In."});

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({ 
            username: username, 
            email: email , 
            password: hashedPassword,
            profile:{ joined: Date.now(), fullName: username, email: email }
        }); 

        const token = jwt.sign({             
            id: newUser._id , 
            username: newUser.username,
            email: email,
            role: newUser.role
        },
            process.env.JWT_SECRET, 
            { expiresIn : '1d'}
        )

        await newUser.save();  // Writing to Database


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: "SignUp Succesfull.",
            token,
            user: {
                id: newUser._id,
                username: username,
                email: email,
            }
        })
    } catch (err) {
        console.error("In SignUp ", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err
        })
    }
}

module.exports = SignUp;