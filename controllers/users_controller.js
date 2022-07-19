const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function (req, res) {
    User.findById(req.params.id, function (err, user) {

        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });

    });
}

module.exports.update = async function (req, res) {
  
    if (req.user.id == req.params.id) {

        try {

            let user = await User.findByIdAndUpdate(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) { console.log('***Multer Error: ', err) }

                //console.log(req.file);

                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..' , user.avatar));  
                    }


                    //this is saving path of the uploaded file into the avatar field in the user

                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();

                return res.redirect('back');

            })

        } catch {
            req.flash('error', 'Post creation failed');

            console.log('Error', err);
            return;
        }


    } else {

        return res.status(401).send('Unauthorized');

    }

}

// render the sign up page
module.exports.signUp = function (req, res) {

    //if user already signed in redirect to profile page
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }


    return res.render('user_sign_up', {
        title: "Winger | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function (req, res) {

    //if user already signed in , redirect to profile page
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.render('user_sign_in', {
        title: "Winger | Sign In"
    })
}

// get the sign up data
module.exports.create = function (req, res) {
    
    // console.log(req.body.password);

    // var domain = req.body.email.substring(req.body.email.lastIndexOf("@") +1);
    // if(domain === "thapar.edu"){

        console.log(req.body.password);

    if (req.body.password != req.body.confirm_password) {
        
        req.flash('Passwords dont match');
        
        return res.redirect('back');
    }

    User.uploadedAvatar(req, res, function (err) {

        if (err) {
            console.log('***Multer Error: ', err)
        }

            User.findOne({ email: req.body.email }, function (err, user) {

                if (err) { console.log('error in finding user in signing up'); }
        
                if (!user) {
                    User.create(req.body, function (err, user) {
                        if (err) { console.log('error in creating user while signing up', err); return }
        
                        if (req.file) {
                            user.avatar = User.avatarPath + '/' + req.file.filename;
                            user.save();
                        }
                            
                        return res.redirect('/users/sign-in');
                    })
                } else {
                    return res.redirect('back');
                }
        
            });
        });

     }
//else{

//         req.flash('error', 'Invalid Host Domain');
//         return res.redirect('back');

//     }
// }


// sign in and create a session for the user
module.exports.createSession = function (req, res) {

    req.flash('success', 'Logged in Successfully');

    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
    
    // req.logout();
    // req.flash('success', 'You have logged out!');
    // return res.redirect('/users/sign-in');

    req.logout(function(err) {
        if (err) { return next(err); }

        req.flash('success', 'You have logged out!');
        res.redirect('/users/sign-in');
      });

}

module.exports.forget_email_page=function(req,res){
    return res.render('forget_email',{
        title:'Forgot Password'
    });
}