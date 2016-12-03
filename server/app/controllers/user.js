var express = require('express'),
	logger = require('../../config/logger'),
	mongoose = require('mongoose'),
    User = mongoose.model('User'),
		Chirp = mongoose.model('Chirps'),
  	router = express.Router(),  
		passportService = require('../../config/passport'),
    passport = require('passport');


var requireAuth = passport.authenticate('jwt', { session: false });
		requireLogin = passport.authenticate('local', { session: false });


module.exports = function (app) {
  	app.use('/api', router);  


router.route('/users/screenName/:name')	
 		.get(function (req, res, next) {
    console.log('Get User ' + req.params.name, 'verbose');
		logger.log('Get User ' + req.params.name, 'verbose');
    User.findOne({ screenname: req.params.name })
    .exec()	
			.then(function (user) {	
        res.status(200).json(user);
			})
			.catch(function (err) {
				return next(err);
			});
  });


	
  router.route('/users/followedChirps/:id')

    .get(function (req, res, next) {
      console.log('Get Users followed chirps ' + req.params.id);
      User.findOne({ _id: req.params.id }, function (err, user) {
        if (!err) {
          Chirp.find({
            $or: [
              { chirpAuthor: user._id }, { chirpAuthor: { $in: user.follow } }
            ]
          }).populate('chirpAuthor').sort({ dateSubmitted: -1 }).exec(function (err, chirps) {
            if (!err) {
              res.status(200).json(chirps);
            } else {
              res.status(403).json({ message: "Forbidden" });
            }
          });
        }
      });
    });



		
router.route('/users/follow/:id')	

		.put(function (req, res, next) {
		logger.log('Update User ' + req.params.id, 'verbose');
		User.findOne({ _id: req.params.id }).exec()
			.then(function (user) {
				if (user.follow.indexOf(req.body._id) == -1) {
					user.follow.push(req.body._id);
					user.save()
						.then(function ( user) {
							res.status(200).json(user);
						})
						.catch(function (err) {
							return next(error);
						});
				}
			})
			.catch(function (err) {
				return next(err);
			});
		});


router.route('/users/:id')	
	.delete(requireAuth, function (req, res, next) {
      logger.log('Delete User ' + req.params.id, 'verbose');
      var query = User.remove({ _id: req.params.id })
        .exec()
        .then(function (result) {
          res.status(204).json({ message: 'Record deleted' });
        })
        .catch(function (err) {
          return next(err);
        });
    })

	.get(requireAuth, function (req, res, next) {
		
	    logger.log('Get User ' + req.params.id, 'verbose');
      	var query = User.findById(req.params.id)
        .exec()
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function(err) {
          return next(err);
        });

		})


		.put(function (req, res, next) {
      logger.log('Update User ' + req.params.id, 'verbose');
      // var query = User.findById(req.params.id)
      //   .exec()
      //   .then(function (user) {
      var query = User.findById(req.params.id)
        .exec()
        .then(function (user) {
          if (req.body.firstName !== undefined) {
            user.fname = req.body.fname;
          };
          if (req.body.lastName !== undefined) {
            user.lname = req.body.lname;
          };
          if (req.body.screenName !== undefined) {
            user.screenname = req.body.screenname;
          };
          if (req.body.email !== undefined) {
            user.email = req.body.email;
          };
          if (req.body.password !== undefined) {
            user.password = req.body.password;
          };

          return user.save();
        })
        .then(function(user) {
          res.status(200).json(user);
        })
        .catch(function (err) {
          return next(err);
        });
    })



router.route('/users')	
//		.get(requireAuth, function (req, res,next) {
		.get(function (req, res,next) {
		logger.log("Get all users","verbose");	
		var query = User.find()
        .sort(req.query.order)
        .exec()
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function(err){
          return next(err);
        });
				
		})
		
		.post(function(req, res, next){
      console.log("got api")
			      logger.log('Create User', 'verbose');
     			  var user = new User(req.body);
    			  user.save()
      			  .then(function (result) {
                   res.status(201).json(result);
          })
               .catch(function(err){
               return next(err);
      })
	  })
		

		router.route('/users/login')
		.post(requireLogin, login);

		};