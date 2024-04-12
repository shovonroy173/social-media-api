const express = require("express");
const router = express.Router();
const Comment = require("../model/Comment.js");

router.post("/" , async(req , res)=>{
    const {loggedUserId , id , comment} = req.body;
    try {
        const newComment = new Comment({userId:loggedUserId , postId:id , comment});
        const savedComment = await  newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/getComments/:id" , async(req , res)=>{
    try {
        const comments = await Comment.find({postId:req.params.id});
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;