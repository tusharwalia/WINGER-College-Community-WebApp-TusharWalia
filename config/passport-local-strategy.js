const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    function(req, email, password, done){
        // find a user and establish the identity

        // checking that only thapar domain is allowed to signup

        var domain = email.substring(email.lastIndexOf("@") +1);
        if(domain === "thapar.edu"){
        
        User.findOne({email: email}, function(err, user)  {
            if (err){
                //console.log('Error in finding user --> Passport');
                req.flash('error', err);
                return done(err);
            }

            if (!user || user.password != password){
                //console.log('Invalid Username/Password');
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
        });
    }else{

        // done(new Error("Invalid host domain"));

        req.flash('error', 'Invalid Host Domain');
                return done(null, false);
    }
}


));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});

//check if the user is authenticated 

passport.checkAuthentication = function(req,res,next){

    //if user signed in then pass on the request to users controller action
    if(req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in
    res.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = function(req,res,next){

    if(req.isAuthenticated()){

        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views 
        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;