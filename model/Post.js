const { default: mongoose } = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId:{type:String } , 
    desc:{
        type:String , 
        max:500 , 
    } , 
    imgUrl:{
        type:String
    } , 
    likes:{
        type:Array , 
        default:[] ,
    } , 
} , {timestamps:true});
module.exports =  mongoose.model("Post" , PostSchema);