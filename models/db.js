var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var dbURL = "mongodb://127.0.0.1:27017/studentDB";


mongoose.set('useCreateIndex', true);
mongoose.connect(dbURL,{ useNewUrlParser: true });

mongoose.connection.on('connected', function(){
    console.log('mongoose connected to '+ dbURL);
});
mongoose.connection.on('error', function(err){
    console.log('mongoose connection error'+ err);
});
mongoose.connection.on('disconnected', function(){
    console.log('mongoose disconnected ' );
});