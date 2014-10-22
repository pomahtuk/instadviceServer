/*global require, process, console*/

'use strict';

var Hapi        = require('hapi'),
  kue           = require('kue'),
  server        = new Hapi.Server(3000, 'localhost'),
  Mongoose      = require('mongoose'),
  mongoURI      = process.env.MONGOLAB_URI ? process.env.MONGOLAB_URI : 'mongodb://localhost/instadvice',
  UpdateRecord  = require('./models/update'),
  jobs          = kue.createQueue();

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
  path: '/subscription/',
  method: 'GET',
  handler: function(request, reply) {
    reply(request.query['hub.challenge']);
  }
});

server.route({
  path: '/subscription/',
  method: 'POST',
  handler: function(request, reply) {
    var updates = request.query, record;

    function createQueueJob (dbRecord) {
      jobs.create('get_image', dbRecord);
    }

    if (typeof updates === 'object') {
      for (var i = 0; i < updates.length; i++) {

        console.log(updates[i]);

        record = new UpdateRecord(updates[i]);
        record.save(createQueueJob);
      }
    }
    reply('ok');
  }
});

kue.app.listen(3003);

server.start(function() {
    console.log('Hapi server started @', server.info.uri);
});
