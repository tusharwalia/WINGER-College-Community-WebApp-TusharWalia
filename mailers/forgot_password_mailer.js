const nodemailer=require('../config/nodemailer');

exports.forgot_password=(link,mail)=>{
    let htmlString=nodemailer.renderTemplate({link},'./reset_password/reset.ejs')
    
    console.log('abv transporter')
    
    nodemailer.transporter.sendMail({
        from: 'rishicr72000@gmail.com',
        to: mail,
        subject: "Reset Password",
        html: htmlString,
        
    },function(err){
        if(err){

            console.log(err);
            console.log("Reset email not sent");
            return;
        }
        else{
            console.log("Reset Mail Sent")
        }
    })
}
