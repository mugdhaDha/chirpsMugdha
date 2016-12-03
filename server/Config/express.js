var express = require('express'),
    morgan = require('morgan'),
    logger = require('./logger'),
    mongoose = require('mongoose'),
    glob = require('glob'),
    cors = require('cors'),
    bodyParser = require('body-parser');

module.exports = function (app, config) {
    logger.log("Starting application");
    app.use(express.static(config.root + '/public'));
    app.use(cors());

    mongoose.connect(config.db);
    mongoose.Promise = global.Promise;
    var db = mongoose.connection;
    db.on('error', function () {
        throw new Error('unable to connect to database at ' + config.db);
   });

  if(process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));    
    mongoose.set('debug', false);
    mongoose.connection.once('open', function callback() {
      logger.log("Mongoose connected to the database");
    });
    app.use(function (req, res, next) {
      logger.log('Request from ' + req.connection.remoteAddress, 'info');
      next();
    });
  }

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(express.static(config.root + '/public'));

  var models = glob.sync(config.root + '/app/models/*.js');
  models.forEach(function (model) {
    require(model);
  });

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
      controllers.forEach(function (controller) {
      require(controller)(app, config);
  });

  app.use(function (req, res) {
    res.type('text/plan');
    res.status(404);
    res.send('404 Not Found From Express.js');
  });

//the below code makes sure we write errors on console only when we are not in test environment
  app.use(function (err, req, res, next) {
    if(process.env.NODE_ENV !== 'test') logger.log(err.stack,'error');
    res.type('text/plan');
        if(err.status){
      res.status(err.status).send(err.message);
    } else {
      res.status(500).send('500 Sever Error');
    }

  });


}

