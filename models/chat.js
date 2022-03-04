const mongoose=require('mongoose');

const chatSchema=new mongoose.Schema({
    username:{
        type:'String',
        required:true
    },
    message:{
        type:'String',
        required:true
    },
    link:{
        type:'String'
    },
    reply:{
        type:'String'
    },
    user_email:{
        type:'String',
        required:true
    },
    date:{
        type:'String',
        required:true
    },
    time:{
        type:'String',
        required:true
    }
},{
    timestamps:true
});

const Chat = mongoose.model('Chat' , chatSchema);
module.exports = Chat;