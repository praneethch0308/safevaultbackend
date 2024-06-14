const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')
const fetchuser = require('../middlewares/fetchuser');
require('dotenv').config();

const JWT_SECRET = process.env.SECRET_KEY;

//ROUTE 1 : Create a user using: POST "/api/auth/createuser", No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false
    // If there are validation errors, return Bad Request with the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        // Check whether the email already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)


        // Create the user
        user = await User.create({
            name: req.body.name,
            password: hashedPassword,
            email: req.body.email,
        });
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)

        success = true
        res.json({success, authtoken})

    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
});

// ROUTE2: Authenticate a user using: POST "/api/auth/login". No login is required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank' ).exists(),

], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try{
        let user = await User.findOne({email})
        if(!user){
            success = false
            return res.status(400).json({error: "Invaild credentilas1"})

        }

        const passwordcompare = await bcrypt.compare(password, user.password)
        if(!passwordcompare){
            success = false
            return res.status(400).json({success, error: "Invalid credentials2"})
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({success, authtoken})


    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server Error");
    }
})

// ROUTE 3: Get Logged in User Details using: POST "/api/auth/getuser", login is required
router.post('/getuser', fetchuser, async (req, res) => {

try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
} catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
}
})



module.exports = router;
