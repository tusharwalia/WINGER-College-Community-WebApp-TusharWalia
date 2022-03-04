const mongoose=require('mongoose');

const friendSchema=new mongoose.Schema({
    //the user who sent this request
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //the user who accepted this request
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    
},{
    timestamps:true
});

const Friendship=mongoose.model('Friendship',friendSchema);
module.exports=Friendship;