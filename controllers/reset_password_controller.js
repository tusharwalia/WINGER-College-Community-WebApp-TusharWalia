const crypto=require('crypto');
const User=require('../models/user');
const ResetToken=require('../models/reset-password-token');
const reset_password=require('../mailers/forgot_password_mailer.js');

module.exports.send_mail = function(req,res){
    //console.log(req.body.email);
    //console.log(req.body.name);

    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log("Error",err);
            return;
        }
            if(!user){


                req.flash('error', 'User not registered');

                console.log("User with the entered email is not found");
                return res.redirect('/users/forget-password')
            }
            else{
                ResetToken.create({
                    user:user.id,
                    accessToken: crypto.randomBytes(20).toString('hex'),
                    isValid:true
                },function(err,newToken){
                    if(err){
                        console.log('Error while creating token');
                        return;
                    }
                    else
                    {

                        
                        reset_password.forgot_password(`http://localhost:8000/users/reset_password_page/${newToken.accessToken}`,req.body.email);
                        return res.render("mail_sent",{
                            mail:req.body.email,
                            title:'Reset Password'
                        });
                    }

                })
            }
        
    })
}

module.exports.reset_password_page=function(req,res){
    ResetToken.findOne({accessToken:req.params.id},function(err,token){
        if(err){
            console.log('Error in finding token');
            return;
        }
        console.log(token.isValid);
        if(token){
            return res.render('password_reset_page',{
                token:token,
                title:'Reset Password Page'
            })
        }
    })
}

module.exports.changePassword=function(req,res){
    ResetToken.findOne({accessToken:req.params.id},function(err,token){
        if(err){
            console.log('Error in finding token');
            return;
        }
        if(token){
            User.findById(token.user,function(err,user){
                if(err)
                {
                    console.log('Error in finding the user');
                    return;
                }
                if(user){
                    if(req.body.pass!=req.body.confirm_pass)
                    {
                        console.log("Passwords do not match!!");
                        req.flash('error','Passwords do not match');
                        res.redirect(`/users/reset_password_page/${token.accessToken}`);
                    }
                    else
                    {
                        console.log(user.password,req.body.pass);
                        user.password=req.body.pass;
                        user.save();
                        console.log('Password changed');
                        token.isValid=false;
                        token.save();
                        console.log(token);
                        req.flash('success','Password changed');
                        return res.redirect('/users/sign-in');
                    }
                }
            })
        }
    })
}