var mongoose = require("mongoose"),
User = require('../app/models/user');
Chirps = require('../app/models/chirps');

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index.js');
var should = chai.should();

chai.use(chaiHttp);

describe('User', () => {
	beforeEach((done) => { 
		User.remove({}, (err) => {
			done();
		});
	})

	it('it should GET the index.html file', (done) => {
		chai.request(server)
			.get('/index.html')
			.end((err, res) => {
				res.should.have.status(200);
				res.should.be.html;
				done();
			});
	});

	it('it should return 404', (done) => {
		chai.request(server)		
			.get('/index2.html')
			.end((err, res) => {
				res.should.have.status(404);
				done();
			});
	});


	it('it should GET all the users', (done) => {
		chai.request(server)
			.get('/api/users')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(0);
				done();
			});
	});


	it('it should POST a user', (done) => {
			var user = {
				"fname": "Jane",
				"lname": "Doe",
				"email": "one@hoo.com",
				"screenname": "JoJo",
				"password": "pass"
			}
			chai.request(server)
			.post('/api/users')
			.send(user)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.have.property('fname');
				res.body.fname.should.be.a('string');
				res.body.fname.should.equal('Jane');
				done();
			});
		});

		it('it should not POST a user without email field', (done) => {
			var user = {
				"fname": "Jane",
				"lname": "Doe",
				"screenname": "JoJo",
				"password": "pass"
			}
			chai.request(server)
			.post('/api/users')
			.send(user)
			.end((err, res) => {
				res.should.have.status(500);
				done();
			});
		});

		it('it should GET a user by the given id', (done) => {
			var user = new User({
					"fname": "Jane",
					"lname": "Doe",
					"email": "one@hoo.com",
					"screenname": "JoJo",
					"password": "pass"
				});
			
			user.save((err, user) => {
				chai.request(server)
				.get('/api/users/' + user._id)
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('fname');
					res.body.should.have.property('lname');
					res.body.should.have.property('email');
					res.body.should.have.property('screenname');
					res.body.should.have.property('_id').eql(user._id.toString());
					done();
					});
				});

		});

		it('it should UPDATE a user', (done) => {
				var user = new User({
					"fname": "Parth",
					"lname": "Dha",
					"email": "oone@hoo.com",
					"screenname": "Joey",
					"password": "pass1"
				});

				user.save((err, user) => {
					chai.request(server)
					.put('/api/users/' + user._id)
					.send({
						"_id": user._id,
						"fname": "Jane",
						"lname": "Doe",
						"email": "woo@hoo.com",
						"screenname": "parth2",
						"password": "pass"
						})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('email').eql('woo@hoo.com');
						res.body.should.have.property('screenname').eql('Joey');
						done();
						});
					});
				});

	it('it should GET a user given the screenname', (done) => {

		var user = new User({
				"fname": "ABC",
				"lname": "Doe",
				"email": "one@hoo.com",
				"screenname": "panm",
				"password": "pass2"
			});

			user.save((err, user) => {
				chai.request(server)
					.get('/api/users/screenName/panm')
					.send(user)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('fname');
						res.body.should.have.property('lname');
						res.body.should.have.property('email');
						res.body.should.have.property('screenname');
						res.body.should.have.property('_id').eql(user._id.toString());
						done();
					});
			});
		});

		it('it should DELETE a user given the id', (done) => {
			var user = new User({
				"fname": "Jane",
				"lname": "Doe",
				"email": "five@hoo.com",
				"screenname": "JoJo",
				"password": "pass"
			});
			user.save((err, user) => {
				chai.request(server)
				.delete('/api/users/' + user.id)
				.end((err, res) => {
					res.should.have.status(204);
					done();
					});
				});
			});

	it('it should UPDATE a users follow array', (done) => {

		var user = new User({
				"fname": "Jane",
				"lname": "Doe",
				"email": "five@hoo.com",
				"screenname": "JoJo",
				"password": "pass"
			});

		user.save((err, user) => {
			chai.request(server)
			.put('/api/users/follow/' + user._id)
			.send({
			"_id": "5804ec7fdde8d3035c9bfbcb"
			})
			.end((err, res) => {					
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('follow');
				res.body.follow.should.be.a('array');
				res.body.follow.length.should.be.eql(1);
				done();
				});
			});
		});
	});

describe('UserFollow', function() {
	beforeEach((done) => { //Before each test we empty the database
		User.remove({}, (err) => {
			var user = new User({
				"fname": "Sally",
				"lname": "Jones",
				"email": "SallyJones@hoo.com",
				"screenname": "SoSo",
				"password": "pass"
			});

			user.save((err, user) => {
				USER_ID = user._id;
				var chirp = Chirps({
					"chirp" : "This is a chirp",
					"chirpAuthor" : USER_ID
				});

				chirp.save((err, chirp) => {
					done();
				});
				
			});
		});
		
	});	

	
	it('it should GET a users followed chirps', (done) => {
		
     var user = new User({
		"fname": "Jane",
		"lname": "Doe",
		"email": "eight@hoo.com",
		"screenname": "JoJo",
		"password": "pass"
   		 });
	
        user.save((err, user) => {
        	var NEW_USER_ID = user._id
        	var chirp = Chirps({
		   "chirp": "This is another chirp",
	       "chirpAuthor": user._id
           });
			chirp.save((err, chirp) => {
				chai.request(server)
     			.put('/api/users/follow/' + NEW_USER_ID)
     			.send({"_id": USER_ID })
				.end((err, res) => {					
					chai.request(server)
					.get('/api/users/followedChirps/' + NEW_USER_ID)
					.send(user)
					.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('array');
							res.body.length.should.be.eql(2);
							res.body[0].should.have.property('chirp');
							res.body[0].chirp.should.be.a('string');
							res.body[0].chirp.should.equal('This is another chirp'); 
							res.body[1].chirp.should.equal('This is a chirp'); 
				 			done();
							});
						});
					});
				});
			});
	});
