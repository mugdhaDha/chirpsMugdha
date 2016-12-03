var path = require('path'),    
       rootPath = path.normalize(__dirname + '/..'),    
       env = process.env.NODE_ENV || 'development';

var config = {  
       development: {    
                   root: rootPath,    
                   app: {      name: 'Chirp'    },    
                   port: 5000,  
                   db: 'mongodb://127.0.0.1/chirp-dev',
                   secret: "cayennedlikedhistreats"

        },  
        test: {    
                   root: rootPath,    
                   app: {      name: 'Chirp'    },    
                   port: 5000,  
                   db: 'mongodb://127.0.0.1/chirp-test',
                   secret: "cayennedlikedhistreats"

        },  
        production: {    
                     root: rootPath,    
                     app: {      name: 'Chirp'    },    
                     port: 80, 
                     db: 'mongodb://127.0.0.1/chirp-prod',
                     secret: "cayennedlikedhistreats"
                     }
         };

module.exports = config[env];
