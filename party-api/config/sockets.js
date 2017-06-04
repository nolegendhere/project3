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
