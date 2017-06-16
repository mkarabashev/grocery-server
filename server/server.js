'use strict';

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/grocery';

// establish server
const server = app();

// connect to mongoDB
mongoose.Promise = global.Promise;
const options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};

const connect = () => mongoose.connect(MONGODB_URI, options);
connect();

const db = mongoose.connection;
db.on('error', console.log);
db.on('disconnected', connect);

// start listening
db.once('open', function open () {
  console.log(`DB connection established for process ${process.pid}`);
  server.listen(PORT, () =>
    console.log(`Process ${process.pid} listening on port ${PORT}`));
});
