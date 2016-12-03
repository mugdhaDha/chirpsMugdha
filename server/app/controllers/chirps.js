var express = require('express'),
	logger = require('../../config/logger'),
	passportService = require('../../config/passport'),
    passport = require('passport'),
  	router = express.Router(),  
	mongoose = require('mongoose'),
    Chirps = mongoose.model('Chirps');

var requireAuth = passport.authenticate('jwt', { session: false });


module.exports = function (app) {
  	app.use('/api/chirps', router);  


	router.route('/')	
		.get(function (req, res) {
				logger.log("Get all Chirps","verbose");	
				var query = Chirps.find()
				.sort(req.query.order)
				.exec()
				.then(function (result) {
					res.status(200).json(result);
					})
				.catch(function(err){
					return next(err);
					});
				})

		.put(function (req, res) {
			logger.log("Update a Chirp","verbose");					
			res.status(200).json({msg: "Update a Chirp"});
			})

		.post(function (req, res) {
			logger.log('Create Chirp', 'verbose');
			var chirps = new Chirps(req.body);
			chirps.save()
			.then(function (result) {
				res.status(201).json(result);
				})
			.catch(function(err){
				return next(err);
				})
			});

	router.route('/:id')	
		.get(function (req, res) {
			logger.log('Get the chirp ' + req.params.id, 'verbose');
			var query = Chirps.findById(req.params.id)
			.exec()
			.then(function (result) {
				res.status(200).json(result);
				})
			.catch(function(err) {
				return next(err);
				})
			})
				

		.delete(function (req, res, next) {
            logger.log('Delete Chirp ' + req.params.id, 'verbose');
            var query = Chirps.remove({ _id: req.params.id })
            .exec()
            .then(function (result) {
           		 res.status(204).json({ message: 'Record deleted' });
           	 	})
           .catch(function (err) {
           		 return next(err);
           		});
          	 })

		.put(function (req, res) {
	  		logger.log('Update Chirps ' + req.params.id, 'verbose');
      		var query = Chirps.findOneAndUpdate(
				{ _id: req.params.id }, 
				req.body, 
				{ new: true })
   		   		 .exec()
      			.then(function (result) {
     	     		res.status(200).json(result);
    		    })
     	 		.catch(function(err){
        	 		 return next(err);
      				})
			});

		
	router.route('/userChirps/:id')	
		.get( function(req, res,next){
			logger.log('Get User Chirps ' + req.params.id, 'verbose');
			Chirps.find({chirpAuthor: req.params.id})
			.populate('chirpAuthor')
			.sort("-dateCreated")
			.exec()
			.then(function(chirps){
				res.status(200).json(chirps);
			})
			.catch(function(err){
				return next(err);
			})

	});
	

	router.route('/like/:id')	
		.put( function(req, res, next){
      		logger.log('Update Chirp ' + req.params.id,'debug');
      		Chirps.findOne({_id: req.params.id})
			.exec()
			.then(function(chirp){
          		chirp.likes++;
          		return chirp.save();
			})
		.then(function(chirp){
			res.status(200).json(chirp);
			})
		.catch(function (err) {
		return next(err);
		});
    });

	



}