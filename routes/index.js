/* global require, module, console */

'use strict';

var UpdateRecord  = require('../models/update'),
  kue             = require('kue'),
  jobs            = kue.createQueue();

function setupRoutes(server) {

  server.route({
    path: '/',
    method: 'GET',
    handler: function (request, reply) {
      reply('Hello, world!');
    }
  });

  server.route({
    path: '/subscription',
    method: 'GET',
    handler: function (request, reply) {
      reply(request.query['hub.challenge']);
    }
  });

  server.route({
    path: '/subscription',
    method: 'POST',
    handler: function (request, reply) {
      var updates = request.payload, record, update, i;

      function createQueueJob(err, dbRecord) {
        if (err) {
          console.log(err);
        } else {
          jobs.create('get_image', dbRecord)
            .attempts(3)
            .backoff(true)
            .save();
        }
      }

      if (typeof updates === 'object') {
        for (i = 0; i < updates.length; i++) {
          update = updates[i];
          // left for debugging using logs
          console.log(update);
          record = new UpdateRecord(update);
          record.save(createQueueJob);
        }
      }
      reply('ok');
    }
  });
}

module.exports = {
  setupRoutes: setupRoutes
};