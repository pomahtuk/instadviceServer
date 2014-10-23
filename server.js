/*global require, process, console*/

'use strict';

var Hapi        = require('hapi'),
  kue           = require('kue'),
  server        = new Hapi.Server(3000, 'localhost'),
  Mongoose      = require('mongoose'),
  mongoURI      = process.env.MONGOLAB_URI ? process.env.MONGOLAB_URI : 'mongodb://localhost/instadvice',
  UpdateRecord  = require('./models/update'),
  jobs          = kue.createQueue(),
  express       = require('express'),
  http          = require('http'),
  app           = express(),
  Good          = require('good');

// MongoDB Connection
Mongoose.connect(mongoURI);

server.route({
    path: '/',
    method: 'GET',
    handler: function(request, reply) {
        reply('Hello, world!');
    }
});

server.route({
  path: '/subscription',
  method: 'GET',
  handler: function(request, reply) {
    reply(request.query['hub.challenge']);
  }
});

server.route({
  path: '/subscription',
  method: 'POST',
  handler: function(request, reply) {
    var updates = request.payload, record, update;

    function createQueueJob (err, dbRecord) {
      if (err) { 
        console.log(err);
      } else {
        jobs.create('get_image', dbRecord).save();
      }
    }

    if (typeof updates === 'object') {
      for (var i = 0; i < updates.length; i++) {
        update = updates[i];
        record = new UpdateRecord ({'object': 'test'});
        record.save(createQueueJob);
      }
    }
    reply('ok');
  }
});


// initialize Kue web interface
app.use('/kue', kue.app);

http.createServer(app).listen(3003, function(){
  console.log('Express server listening on port 3000. Point browser to route /kue');
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

