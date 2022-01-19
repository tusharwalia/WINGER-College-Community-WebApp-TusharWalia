const { populate } = require("../models/post");
const Post = require("../models/post");

module.exports.home = function(req, res){
    // console.log(req.cookies);
    // res.cookie('user_id', 25);

//     Post.find({},function(err,posts){
//             return res.render('home', {
//                 title: "Winger | Home",
//                 posts: posts
//     });
// });

//populate the user of each post
//popute the comments of each post and further populate the user of each comment
Post.find({})
.populate('user')
.populate({
    path: 'comments',
    populate: {
        path: 'user'
    }
})
.exec(function(err,posts){
    return res.render('home', {
        title: "Winger | Home",
        posts: posts
});

})}

// module.exports.actionName = function(req, res){}