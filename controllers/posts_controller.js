const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function (req, res) {

    // try {

    //     let posts = await Post.create({
    //         content: req.body.content,
    //         user: req.user._id,
             
    //     }
        
    //     );
       
    //     posts = await posts.populate('user', 'name').execPopulate();
       
    //     Post.uploadedPostImage(req, res, function (err) {

    //         if (err) { console.log('***Multer Error: ', err) }

    //         console.log('inside post');
    //         if (req.file) {

    //             console.log('inside post image');
    //             // if(posts.post_image){
    //             //     fs.unlinkSync(path.join(__dirname, '..' , user.avatar));  
    //             // }


    //             //this is saving path of the uploaded file into the avatar field in the user

    //             posts.post_image = Post.postImagePath + '/' + req.file.filename;
    //         }

    //         if (req.xhr) {

    //             //just populating the name of the user, we dont want to send the password 

    //             return res.status(200).json({
    //                 data: {
    //                     post: posts
    //                 },
    //                 message: "post created"
    //             })
    //         }
    //         req.flash('success', 'Post created successfully');

    //         return res.redirect('back');
    //     })
    // } catch (err) {

    //     req.flash('error', 'Post creation failed');

    //     console.log('Error', err);
    //     return;
    // }


    try{
        let post;
        await Post.uploadedPostImage(req,res,function(err){
            if(err){
                console.log("Error in multer",err);

            }
            else
            {
                let image;
                if(req.file){
                    
                    image=Post.postImagePath + '/' + req.file.filename; 
                    console.log("***Image*** ",image);
                }
                
                console.log(req.body.content);

                Post.create({

                    
                    content:req.body.content,
                    user:req.user._id,
                    post_image:image
                },async function(err,newPost){
                    if(err){
                        console.log("Error in creating post");
                        return res.redirect('/');
                    }
                    
                    if(req.xhr){
                        console.log("Inside xhr");
                        await newPost.populate('user','name').execPopulate();
                        return res.status(200).json({
                            data:{
                                post:newPost,
                            },
                            message:'Post created',
                        });       
                    }
                    console.log("****POST created***");
                    req.flash('success','Post Created');
                    return res.redirect('back');
                    
                });
            }
        });
        
        

    }
    catch(err){
        req.flash('error','Error in posting. Try Again');
        console.log("Error",err);
        return;
    }

}

module.exports.destroy = async function (req, res) {

    try {

        let post = await Post.findById(req.params.id)

        // .id means converting the obj into a string
        if (post.user == req.user.id) {
            
            //for deleting the likes associated with the posts and comments of the posts

            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            
            
            post.remove();

            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post Deleted"
                });
            }

            req.flash('success', 'Post deleted successfully');

            return res.redirect('back');

        } else {

            req.flash('error', 'You cannot delete this post');

            return res.redirect('back');
        }

    } catch (err) {

        console.log('Error', err);
        return;
    }


}
