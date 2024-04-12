const express = require("express");
const User = require("../model/User");
const router = express.Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
  console.log("LINE AT 8" , req.body , req.params.id);
  // const user = await User.findById({ _id: req.params.id });
  // const loggedUser = await User.findById({ _id: req.body.userId });
  // if (loggedUser._id.equals(user._id)) {
  //   // update password
  //   if (req.body.password) {
  //     try {
  //       const salt = await bcrypt.genSalt(10);
  //       const hashedPassword = await bcrypt.hash(req.body.password, salt);
  //       req.body.password = hashedPassword;
  //     } catch (error) {
  //       console.log(error);
  //       res.status(500).json(error);
  //     }
  //   }
    // else{
       // update username and description
      try {
        const user = await User.findByIdAndUpdate(
          req.params.id,
          // { $set: { name: req.body.name } },
          { $set: { birthday: req.body.birthday } },
          { new: true }
        );
        res.status(200).json(user);
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    // }
  // } else {
  //   return res.status(401).json("Only own account can be updated!");
  // }
});

// delete a user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    const loggedUser = await User.findById({ _id: req.body.userId });
    if (loggedUser._id.equals(user._id)) {
      await User.findByIdAndDelete({ _id: req.params.id });

      res.status(200).json("Account has been deleted!");
    } else {
      return res
        .status(401)
        .json("You do not have permission to perform this!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// get users
router.get("/", async (req, res) => {
  try {
    const userData = await User.find();
    // console.log(userData);
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const userData = await User.findById({_id:req.params.id});
    // console.log(userData);
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get logged user
router.get("/:id", async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.params.id });
    // console.log(userData);
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// search a user
router.get("/find/users" , async(req , res)=>{
  console.log(req.query);
      try {
        const query = req.query.q;
        // console.log(query);
        const user = await User.find({name:{$regex:query , $options:"i"}}) ;
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

// get a friend profile
router.get("/friend/:id" , async(req , res)=>{
    try {
    const userData = await User.findById({ _id : req.params.id});
    res.status(200).json(userData);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// get close friends of a currentUser
router.get("/friends/:userId" , async(req , res)=>{
  try {
    const user = await User.findById( req.params.userId);
    // console.log("LINE AT 124" , user);
    const closeFriends = await Promise.all(
      user.followings.map((id)=>{
        return User.findById(id);
      })
    );
    const friendList = [];
    closeFriends.map((friend)=>{
      const {_id , name} = friend;
      friendList.push({_id , name});
    });
    // console.log("LINE AT 134" , friendList);
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
});

// follow and unfollow an user
router.put("/follow/:id" , async(req , res)=>{
  console.log("LINE AT 142" , req.body.userId);

  if(req.params.id !== req.body.userId){
   const user = await User.findById(req.params.id);
   const currentUser = await User.findById(req.body.userId);
   console.log(currentUser);

   if(!user.follower.includes(req.body.userId) && !currentUser.followings.includes(req.params.id)){
    user.follower.push(req.body.userId);
    currentUser.followings.push(req.params.id);
    await user.save();
    await currentUser.save();
    console.log("'Already following!'");
    return res.status(200).json("Following!");
   }
   else{
    const index1 = user.follower.indexOf(req.body.userId);
    const index2 = currentUser.followings.indexOf(req.params.id);
    user.follower.splice(index1 , 1);
    currentUser.followings.splice(index2 , 1);
    await user.save();
    await currentUser.save();
    console.log("'Already following!'");
    return res.status(403).json('Already following!');
   }
  }
  else{
    return res.status(403).json("You can't follow yourself!");
  }
});

// unfollow an user
router.put("/unfollow/:id" , async(req , res)=>{
  const loggedUser = req.body.loggedUser.currentUser._id;
  if(req.params.id !== loggedUser){
    const user = await User.findById({_id : req.params.id});
    const currentUser = await User.findById({_id:loggedUser});
    if(user.follower.includes(loggedUser)){
      try {
        await user.updateOne({
          $pull :{follower:loggedUser}
        });
        await currentUser.updateOne({
          $pull :{followings:req.params.id}
        });
      } catch (error) {
        res.status(500).json(error);
      }
    return res.status(200).json(currentUser)

    }
    else{
      return res.status(403).json("Not followed!")
    }
  }
  else{
    return res.status(403).json("You can't unfollow!");
  }
})

module.exports = router;
