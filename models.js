'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var applicationSchema = new Schema({
    name: String,
    college: String,
    score: Number
})

var application = mongoose.model("application", applicationSchema);
module.exports.application = application;
