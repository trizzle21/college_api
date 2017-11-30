var express = require('express'),
    http = require('http');
const routes = require('./routes');

var bodyParser = require('body-parser')
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/college_db", {useMongoClient:true}, function(error, response) {
    if (error) {
        console.log("ERROR connecting to database: mongodb://localhost:27017/college_db" + error);
    } else {
        console.log("Connected to database: mongodb://localhost:27017/college_db");
    }
});


mongoose.Promise = global.Promise;


var app = express();


app.listen(3210, function() {
    console.log('App is now running on port', 3210);
});



app.use(bodyParser.json());


// Routes
app.use('/', routes);
