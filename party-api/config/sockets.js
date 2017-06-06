var server = require('./server').server;
var socketIO = require('socket.io');
var jwt = require('jsonwebtoken');
var User = require('../model/user');
var io = socketIO(server);


io.on('connection', function(socket){
  console.log("socket connection");
  socket.auth = false;
  socket.on('authenticate', function(data){
    console.log("data",data);
      jwt.verify(data.token, 'ironhack',(err,decoded)=>{
        if(err){
          console.log("err",err);
          return;
        }
        console.log("decoded",decoded);
        if(decoded){
          User.findById(decoded.id, (err, user)=>{
            if (err) {
              console.log("err",err);
              console.log("Disconnecting socket ", socket.id);
              socket.disconnect('unauthorized');
              throw err;
            }
            console.log("user found?");
            if (user) {
              console.log("user found");
              socket.auth = true;
            }

            if (!socket.auth) {
              console.log("Disconnecting socket ", socket.id);
              socket.disconnect('unauthorized');
            }
          });
        }
    });
  });

  // setTimeout(function(){
  //   //If the socket didn't authenticate, disconnect it
  //   console.log("socket.auth",socket.auth);
  //   if (!socket.auth) {
  //     console.log("Disconnecting socket ", socket.id);
  //     socket.disconnect('unauthorized');
  //   }
  // }, 3000);


    console.log("entraSockets");
    socket.emit('greeting-from-server', {
        greeting: 'Hello Client'
    });

    // socket.on('greeting-from-client', function (message) {
    //   console.log(message);
    // });

    socket.on('room.join', (data)=>{
      console.log("data/////////////////////////////",data);
      socket.join(data.room);
      io.to(data.room).emit('room.joined', socket.id + ' joined the room ' + data.room);
      console.log("emiting jointheroom");
      socket.emit('jointheroom',data);
    });

    // socket.on('notification.join', function (notification) {
    //   socket.join(notification);
    //   io.to(notification).emit('notification.joined', socket.id + ' joined the notification ' + notification);
    // });

    socket.on('room.message', function (room) {
      io.to(room).emit('room.joined', socket.id + ' joined the ' + room);
    });

    socket.on('message.send', function (data) {
        console.log("message recived in socketio server",data);
        // socket.emit('message.sent', {
        //     message: data.message
        // });
        io.to(data.room).emit('message.sent', {
            message: data.message
        });

        // io.to(data.room).emit('notification.sent', {
        //     message: data.message
        // });

    });

    socket.on('disconnectsocket', function () {
      console.log("disconnect from server");
      socket.disconnect();
    });

    socket.on('disconnect', function () {
      console.log('The socket disconnected');
    });


});
