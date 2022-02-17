const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const POST_IMAGE_PATH = path.join('/uploads/users/post-images');

const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    post_image:{
        type: String,
    },

    //for faster reference to comments of a post
    //storing comment ids of a post in an array in respective post schema
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],

    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }]


},{
    timestamps:true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',POST_IMAGE_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

  //static methods

  //single is used so that the user can only upload one file
  postSchema.statics.uploadedPostImage = multer({storage: storage}).single('post_image');
  
  //for accessing AVATAR_PATH globally
  postSchema.statics.postImagePath = POST_IMAGE_PATH;


const Post = mongoose.model('Post' , postSchema);
module.exports = Post;