var express = require('express');
var router = express.Router();

var controller = require('./controller');




router.route('/').get(function(request, response) {
    response.status(200).json('College API is alive!');
});

router.route('/applications').post(function(request, response) { 
    controller.createApplication(request, response)
});

router.route('/applicants/:name?').get(function(request, response) {
    controller.getApplicants(request, response)
});

router.route('/colleges/:name?').get(function(request, response) {
    controller.getColleges(request, response)
});


router.route('/BackUp').post(function(request, response) {
    controller.backUp(request, response)
});


module.exports = router;
