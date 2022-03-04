
const Chat = require('../models/chat');

function convert(date){
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    var day=date.getDate();
    var month=date.getMonth()+1;
    var year=date.getFullYear();
    var hour=date.getHours();
    var min=date.getMinutes();
    rdate=day+'/'+month+'/'+year;
    rtime=hour+':'+min;
    return {
        rdate:rdate,
        rtime:rtime
    }
}

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });


        socket.on('join_room',  function(data){
            console.log('joining request rec.', data);

            var date=new Date();
            const obj= convert(date);
            data.date=obj.rdate;
            data.time=obj.rtime;

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined', data);
        })

        //detect send_message and broadcast to everyone in the room
        socket.on('send_message', function(data){
            
            var date=new Date();
            const obj=convert(date);
            data.date=obj.rdate;
            data.time=obj.rtime;
            
            console.log(data);
            let newMessage = Chat.create(data);
            
            data.id = newMessage.id;
            io.in(data.chatroom).emit('receive_message', data);
        });

    });

}