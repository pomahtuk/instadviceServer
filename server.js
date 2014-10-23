/*global require, process, console*/

'use strict';

var Hapi        = require('hapi'),
  kue           = require('kue'),
  server        = new Hapi.Server(3000, 'localhost'),
  Mongoose      = require('mongoose'),
  mongoURI      = process.env.MONGOLAB_URI ? process.env.MONGOLAB_URI : 'mongodb://localhost/instadvice',
  express       = require('express'),
  http          = require('http'),
  app           = express(),
  Good          = require('good'),
  routes        = require('./routes');

// MongoDB Connection
Mongoose.connect(mongoURI);

// handle routing
routes.setupRoutes(server);

// initialize Kue web interface
app.use('/kue', kue.app);

http.createServer(app).listen(3003, function () {
  console.log('Express server listening on port 3003. Point browser to route /kue');
});

// start server itself
server.pack.register(Good, function (err) {
  if (err) {
    throw err; // something bad happened loading the plugin
  }

  server.start(function () {
    console.log('Hapi server started @', server.info.uri);
  });
});
