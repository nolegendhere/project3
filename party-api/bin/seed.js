const mongoose = require('mongoose');
const User = require('../model/user');
const Party = require('../model/party');
// Bcrypt let us encrypt passwords
const bcrypt          = require("bcrypt");
const bcryptSalt      = 10;

const dbName = 'party-database';
const dbPort = '27017';

// connect to the database
mongoose.connect(`mongodb://localhost:${dbPort}/${dbName}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Connected to the ${dbName} database`);
});

let password = "1";
var salt     = bcrypt.genSaltSync(bcryptSalt);
var hashPass = bcrypt.hashSync(password, salt);
console.log("hi1");
let tempArray = [];
for(let i=0; i<3; i++){
  let newUser = new User({
    username: "user"+i+"@gmail.com",
    password: hashPass,
    profile:{
      firstName: "userFirstName"+i,
      lastName: "userLastName"+i,
      score: 0,
      sex: "Boy",
      age: 18+i,
      pictures:["../public/images/boy.jpg","../public/images/boy.jpg","../public/images/boy.jpg","../public/images/boy.jpg"]
    },
  });
  tempArray.push(newUser);
}
console.log("hi2");

User.create(tempArray, (err, users) => {
  if (err) {
    console.log("hi3");
    throw err;
  }
  console.log("hi4");

  users.forEach((user)=>{
    console.log("hi5");
    let newParty = new Party({
      score: 0,
      name: "party"+user.username,
      theme: "party "+user.username,
      maxPeople: 20,
      owner: user
    });
    console.log("hi6");
    Party.create(newParty,(err,party)=>{
      if(err){
        console.log("hi7");
        throw err;
      }
      console.log("hi8",newParty);
      user.partiesOwned.push(newParty);
      console.log("hi9");
      user.save((err,updatedUser)=>{
        if(err){
          console.log("hi10");
          throw err;
        }
        console.log("hi11");
        //console.log("user",user);
      });
    });
  });
});
