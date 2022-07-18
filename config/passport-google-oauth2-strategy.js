const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: env.google_client_id, // e.g. asdfghjkkadhajsghjk.apps.googleusercontent.com
        clientSecret: env.google_client_secret, // e.g. _ASDFA%KFJWIASDFASD#FAD-
        callbackURL: env.google_callback_url,
    },

    function(accessToken, refreshToken, profile, done){
        
        // find a user
        
        // checking that only thapar domain is allowed to signup
        if(profile._json.hd === "thapar.edu"){

        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if (err){console.log('error in google strategy-passport', err); return;}
            console.log(accessToken, refreshToken);
            console.log(profile);

            if (user){
                // if found, set this user as req.user
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if (err){console.log('error in creating user google strategy-passport', err); return;}

                    return done(null, user);
                });
            }

        }); 
    }else{

        done(new Error("Invalid host domain"));
    }

}


));


module.exports = passport;
