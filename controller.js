var fs = require('fs');
var model = require('./models')

/** @function Creates a Application for college */
module.exports.createApplication = function(req, res) {

    if(!req.body.college || !req.body.name || !req.body.score) {
        res.status(400).json({ "error": "Bad Request.",
                               "message": "All Fields required"});                     
        return;
    }

    model.application.findOne({'college': req.body.college, 'name': req.body.name}, function(err, applicant){
        if(err){
            res.status(500).json({ "error": "Bad Implementation.",
                                    "message": "Something went wrong"});                     
            return;
        } else if (applicant){
            res.status(400).json({ "error": "Bad Request.",
                                   "message": "User already has applied"});                     
            return;

        }

        //create new applicant
        var application = new model.application();
        application.college = req.body.college;
        application.name = req.body.name;
        application.score = req.body.score;

        application.save(function(err){
            if (err) {
                res.status(500).json({ "error": "Bad Implementation.",
                                       "message": "Something went wrong"});                     
                return;

            } else {
                res.status(200).json({ status: 'Application submitted successfully' });
                 
            }
        });
    });


}



/** @function Returns application of person (if provided), otherwise it returns all */
module.exports.getApplicants = function (req, res) {
            if (req.params.name){
                applicant = {
                    "name": req.params.name,
                    "applications":[]
                } 
                model.application.find({'name': req.params.name}).sort({score: -1}).exec(function(err, applications){
                    if (err) {
                        res.status(500).json({ "error": "Bad Implementation.",
                                               "message": "Something went wrong"});                     
                        return;

                            
                    } else {
                        for(i in applications) {
                            applicant.applications.push({
                                                        "college":applications[i].college,
                                                        "score":applications[i].score
                                                        });
                        }
                        
                        res.status(200).json(applicant);

                    }
                });

            } else {
                applicants = {}
                model.application.find({}).sort({name: 1, score: -1}).exec(function(err, applications){

                    for (i in applications) {
                        if(applications[i].name in applicants) {
                            applicants[applications[i].name].push({
                                                        "college": applications[i].college,
                                                        "score":applications[i].score
                                                        });
                        } else {
                            applicants[applications[i].name] = [{  
                                                        "college":applications[i].college,
                                                        "score":applications[i].score
                                                           }]
                        }   
                    }
                });
                res.status(200).json(applicants);

            }
            
    }



/** @function Returns application of college (if provided), otherwise it returns all colleges */
module.exports.getColleges = function (req, res) {
            //if parameter findOne, else find all
            if (req.params.name){
                college = {
                    'college': req.params.name,
                    "applications":[]
                } 
                model.application.find({'college': req.params.name}).sort({score: -1}).exec(function(err, applications){
                    if (err) {
                        res.status(500).json({ "error": "Bad Implementation.",
                                               "message": "Something went wrong"});                     
                        return;

                    } else if (!applications) {
                        res.status(404).json({ "error": "Not Found.",
                                               "message": "No applications exist for that college"});                     
                        return;      
                    } else {
                        for(i in applications) {
                            college.applications.push({
                                                        "name":applications[i].college,
                                                        "score":applications[i].score
                                                     });
                        }
                    }
                        res.status(200).json(college);

                });

            } else {
                colleges = {}
                model.application.find({}).sort({college: 1, score: -1}).exec(function(err, applications){
                    for (i in applications) {
                         if(applications[i].college in colleges) {
                            colleges[applications[i].college].push({
                                                                "name":applications[i].name,
                                                                "score":applications[i].score
                                                                });
                        } else if (!applications) {
                            res.status(404).json({ "error": "Not Found.",
                                                   "message": "No applications exist"});                     
                            return;
                        } else {
                            colleges[applications[i].college] = [{  
                                                            "name":applications[i].name,
                                                            "score":applications[i].score
                                                           }]
                        }   
                    }
                    res.status(200).json(colleges);


                });

            }
            
    }


/** @function Writes college data to backup.json */
module.exports.backUp = function (req, res) {
            colleges = {}
            model.application.find({}).sort({college: 1, score: -1}).exec(function(err, applications){
                for (i in applications) {
                    if(applications[i].college in colleges) {
                        colleges[applications[i].college].push({
                                                        "name":applications[i].name,
                                                        "score":applications[i].score
                                                         });
                    } else if (!applications) {
                        res.status(404).json({ "error": "Not Found.",
                                               "message": "No applications exist"});                     
                        return;
                    } else {
                        colleges[applications[i].college] = [{  
                                                        "name":applications[i].name,
                                                        "score":applications[i].score
                                                       }]
                    }   
                }
            fs.writeFile('./backUp.json', JSON.stringify(colleges), function(err, fd){
                  if (err) {
                        res.status(500).json({ "error": "Bad Implementation.",
                                               "message": "Something went wrong"});                     
                        return;

                  }
                res.status(200).json({"message": "Succesfully Backed Up"});



                });


            });


            
    }



