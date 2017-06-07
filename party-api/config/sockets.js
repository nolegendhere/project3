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

    socket.on('rooms.join', (data)=>{
      // console.log("data/////////////////////////////",data);
      data.rooms.forEach((room)=>{
        console.log("room",room);
        socket.join(room);
      });
    });

    socket.on('list.rooms', function () {
      console.log("sending socket room list");
      console.log("socket.rooms",socket.rooms);
      socket.emit('list.rooms.response', socket.rooms);
    });

    socket.on('message.send', function (data) {
        console.log("message recived in socketio server",data);
        // socket.emit('list.rooms.response', socket.rooms); //as i have in the front end, it will add a listener of this.socketsService.on('message.sent'...
        io.to(data.room).emit('message.sent', {
            message: data.message
        });
    });

    socket.on('notifyUser',(data)=>{
      console.log("user to notify",data);
      io.to(data.roomTo).emit('userNotified',data);
    });

    socket.on('disconnectsocket', function () {
      console.log("disconnect from server");
      socket.emit("connectSocket");
      socket.disconnect();
    });

    socket.on('disconnect', function () {
      console.log('The socket disconnected');
      socket.emit("connectSocket");
    });


});
