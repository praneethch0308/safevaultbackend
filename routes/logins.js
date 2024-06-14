const express = require('express')
const fetchuser = require('../middlewares/fetchuser')
const router = express.Router()
const Logins = require('../models/Logins')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

//ROUTE1: Get all the Logins using: Get "/api/login/fetchalllogins". Login required
router.get('/fetchalllogin', fetchuser, async (req,res)=>{

    try {
        const logins = await Logins.find({user: req.user.id})
        res.json(logins)
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server Error");
    }

})

//ROUTE2: Add a new login using: POST "/api/login/addlogins". Login required
router.post('/addlogin', fetchuser,[
    body('url', 'url is required').isLength({ min: 1 }),
    body('username', 'username is required').isLength({ min: 1 }),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req,res)=>{

    try {
        const { website,url, username, password }= req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // // Hash the password
        // const salt = await bcrypt.genSalt(10)
        // const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const login = new Logins({
            website, url, username, password, user: req.user.id
        })
        const savedLogin = await login.save()
        res.json(savedLogin)

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server Error");
    }

})


// ROUTE3: Update an existing Login using: Get "/api/login/updatelogin". Login required
router.put('/updatelogin/:id', fetchuser, async (req, res) => {
    const { website, url, username, password } = req.body;
    try {
        // Create a newLogin object
        const newLogin = {};
        if (website) { newLogin.website = website; }
        if (url) { newLogin.url = url; }
        if (username) { newLogin.username = username; }
        if (password) {
            // Hash the password
            // const salt = await bcrypt.genSalt(10);
            // const hashedPassword = await bcrypt.hash(password, salt);
            // newLogin.password = hashedPassword;
            {newLogin.password= password}
        }

        // Find the login to be updated and update
        let login = await Logins.findById(req.params.id);
        if (!login) { return res.status(404).send("Not Found"); }

        if (login.user.toString() !== req.user.id) {
            return res.status(401).send("Access Denied");
        }

        login = await Logins.findByIdAndUpdate(req.params.id, { $set: newLogin }, { new: true });
        res.json({ login });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server Error");
    }
});


//ROUTE4: Delete an existing Login using: DELETE "/api/login/deletelogin". Login required
router.delete('/deletelogin/:id', fetchuser,[
    
], async (req,res)=>{
    
    try {
    //Find the login to be deleted and delete it
    let login = await Logins.findById(req.params.id)
    if(!login){return res.status(404).send("Not Found")}

    //Allow deletion only if user owns this note
    if(login.user.toString() !== req.user.id){
        return res.status(401).send("Access Denied")
    }

    login = await Logins.findByIdAndDelete(req.params.id)
    res.json({"Success": "The following note has been deleted", login: login})

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server Error");
    }

})

module.exports = router 