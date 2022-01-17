const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    //for faster reference to comments of a post
    //storing comment ids of a post in an array in respective post schema
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }]
},{
    timestamps:true
});

const Post = mongoose.model('Post' , postSchema);
module.exports = Post;