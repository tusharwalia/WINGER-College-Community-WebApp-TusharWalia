const { _userProperty } = require("passport/lib");
const { populate } = require("../models/post");
const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function(req, res){

    try{

        if(req.isAuthenticated()){
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            
            path: 'comments',
            
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        })
        .populate('likes');

        let currUser;
        // console.log("#######",req.user);

        currUser = await User.findById(req.user._id)
        .populate({
            path: 'friends',
            populate:{
                path: 'from'
            },
            populate:{
                path: 'to'
            }
        });

        console.log(currUser);

        

        // if(req.user){
        //     currUser = await User.findById(req.user._id)
        //     .populate('friends');
        // }

    let users = await User.find({})


    return res.render('home', {
        title: "Winger | Home",
        posts: posts,
        all_users: users,
        currUser: currUser
    });
        
}

    return res.redirect('/users/sign-in');

    }catch(err){

        console.log('Error',err);
        return;

    }
}

module.exports.friend = async function (req,res){
    try{
        let friends=req.user.friends;
        let posts = await Post.find({user:{$in:friends}})
        .sort('-createdAt')
        .populate('user')
        .populate({
          path: 'comments',
          populate: {
              path:'user',
          },
          populate: {
              path: 'likes',
          }
        }).populate('comments')
        .populate('likes');

        let currUser;
        currUser = await User.findById(req.user._id)
        .populate('friends');

        console.log(currUser.friends);

        // if(req.user){
        //     currUser = await User.findById(req.user._id)
        //     .populate('friends');
        // }

        let users=await User.find({});
       
        return res.render('home', {
            title: "Winger | Friends' Posts",
            posts:  posts,
            all_users: users,
            currUser: currUser
        });

    
    }catch(err){
        console.log('Error', err);
        return;
    }
}

module.exports.users=async function(req,res){
    let users=await User.find({});
    let currUser;
    currUser = await User.findById(req.user._id)
    .populate('friends');

    // if(req.user){
    //     currUser = await User.findById(req.user._id)
    //     .populate('friends');
    // }
    return res.render('home',{
        title:'Winger | Users',
        all_users: users,
        currUser: currUser
    });
}

// module.exports.actionName = function(req, res){}