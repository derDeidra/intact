var config = require('config');

// Bring Mongoose into the app
var mongoose = require('mongoose');

// Build the connection string
var mongoPort = config.get('mongo.mongoPort');
var dbName = config.get('mongo.dbName');
var dbLoc = config.get('mongo.dbLoc');
var dbURI = 'mongodb://' + dbLoc + ':' + mongoPort + '/' + dbName;

// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function() {
    console.log('[DB] Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
    console.log('[DB] Mongoose connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
    console.log('[DB] Mongoose connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('[DB] Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});


require('./schema');
