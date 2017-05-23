'use strict';

const mongoose = require('mongoose');
const dbName = 'party-database';
const dbPort = '27017';

// connect to the database
mongoose.connect(`mongodb://localhost:${dbPort}/${dbName}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Connected to the ${dbName} database`);
});
