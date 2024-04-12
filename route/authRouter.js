const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User.js");

router.post("/register" , async(req , res)=>{
    // console.log("LINE AT 7" , req.body
    //      , req.body.email , req.body.password);
    try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password , salt);
            const newUser = new User({
                name:req.body.name , 
                email:req.body.email,
                password:hashedPassword , 
            });
            const user =  await newUser.save();
            res.status(200).json(user);
        
    } catch (error) {
    console.log("LINE AT 7" , req.body.name , req.body.email , req.body.password);

        res.status(500).json(error);
    }
});

router.post("/login" , async(req ,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const singleUser = await User.findOne({email:email});
        if(!singleUser){
            return res.status(401).json("User not found!");
        }
        else{
            const validityCheck = await bcrypt.compare(password , singleUser.password);
            if(!validityCheck){
                return res.status(401).json("Password not matched!");
            }
            else{
                return res.status(200).json(singleUser);
            }
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;