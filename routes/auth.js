const router = require("express").Router();
const User = require("../Models/user_Models")
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// register

router.post("/register", async(req, res) => {
   try {
       const newUser = new User({
           username: req.body.username,
           email: req.body.email,
           password:CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC) // HASHING PASSWORD SAVING TO DB
       });
       const savedUser = await newUser.save();
      return res.status(201).json(savedUser);
   } catch (error) {
    return res.status(500).json(error)
   }
})

// login

router.post("/login", async (req, res) => {
    try {
        //find the username in the db
        const user = await User.findOne({ username: req.body.username });
        //checking if there is no user
        !user && res.status(401).json("wrong credential or kindly register ")
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        //checking if password matches
        originalPassword !== req.body.password && res.status(401).json("incorrect password");
        const accessToken = jwt.sign({
            id: user._id, 
            isAdmin:user.isAdmin,
        },process.env.JWT_SEC,{expiresIn:"2d"})
        // const { password, ...others } = user_docs;
        
        return res.status(201).json({user,accessToken} )
    } catch (error) {
        return res.status(500).json(error)
    }
})

module.exports = router;