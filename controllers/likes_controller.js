const Comment = require("../models/comment")
const Like = require("../models/like")
const Post = require("../models/post")

module.exports.toggleLike=async function(req,res){
    try{
        // likes/toggle?id=hhd&type=Post
        let deleted=false;
        let likeable;
        
        
        if(req.query.type=='Post'){
            likeable=await Post.findById(req.query.id).populate('likes');
        }
        else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }
        
        // check if like already exists
        let existingLike = await Like.findOne({
            user:req.user._id,
            likeable:req.query.id,
            onModel:req.query.type,
        });
        
        if(existingLike){
            // if(category=='like'){
            //     likeable.like.pull(req.user);
            //     likeable.save();
            //     findLike.remove();
            //     deleted=true;
            // }else if(category=='heart'){
            //     likeable.heart.pull(req.user);
            //     likeable.save();
            //     findLike.remove();
            //     deleted=true;
            // }else if(category=='laugh'){
            //     likeable.laugh.pull(req.user);
            //     likeable.save();
            //     findLike.remove();
            //     deleted=true;
            // }

                likeable.likes.pull(existingLike._id);
                likeable.save();
                existingLike.remove();
                deleted = true;

            
        }
        else{
            let newLike=await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type,
                
            });
            
            likeable.likes.push(newLike._id);
            likeable.save();
        }
        if(req.xhr){
            return res.status(200).json({
                message:'Request Successful',
                data:{
                    deleted:deleted,
                   // cat:category
                }
            });
        }
        
        return res.redirect('/');



    }catch(err){
        console.log(err);
        return res.json(500,{
            message:'Internal Server Error'
        })
    }
}