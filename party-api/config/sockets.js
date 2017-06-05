var server = require('./server').server;
var socketIO = require('socket.io');
var jwt = require('jsonwebtoken');
var User = require('../model/user');
var io = socketIO(server);


io.on('connection', function(socket){
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
              throw err;
            }
            if (user) {
              socket.auth = true;
            }
          });
        }
    });
  });

  setTimeout(function(){
    //If the socket didn't authenticate, disconnect it
    if (!socket.auth) {
      console.log("Disconnecting socket ", socket.id);
      socket.disconnect('unauthorized');
    }
  }, 3000);


    console.log("entraSockets");
    socket.emit('greeting-from-server', {
        greeting: 'Hello Client'
    });

    // socket.on('greeting-from-client', function (message) {
    //   console.log(message);
    // });

    socket.on('room.join', function (room) {
      socket.join(room);
      io.to(room).emit('room.joined', socket.id + ' joined the room ' + room);
    });

    socket.on('notification.join', function (notification) {
      socket.join(notification);
      io.to(notification).emit('notification.joined', socket.id + ' joined the notification ' + notification);
    });

    socket.on('room.message', function (room) {
      io.to(room).emit('room.joined', socket.id + ' joined the ' + room);
    });

    socket.on('message.send', function (data) {
        console.log("message recived in socketio server",data);
        io.to(data.room).emit('message.sent', {
            message: data.message 
        });
    });

    socket.on('disconnectsocket', function () {
      console.log("disconnect from server");
      socket.disconnect();
    });

    socket.on('disconnect', function () {
      console.log('The socket disconnected');
    });


});



// io.on('connection', function (socket) {
//   socket.auth = false;
//
//
//
//   console.log("entraSockets");
//   socket.emit('greeting-from-server', {
//       greeting: 'Hello Client'
//   });
//   socket.on('greeting-from-client', function (message) {
//     console.log(message);
//   });
//
//   socket.on('disconnect', function () {
//     console.log('The socket disconnected');
//   });
// });
//
// io.on('connection', function (socket) {
//   console.log("trying another on connection");
//   socket.emit('greeting-from-server', {
//       greeting: 'Hello Client from other io on'
//   });
// });
