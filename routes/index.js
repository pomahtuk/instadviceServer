/* global require, module, console */

'use strict';

var kue   = require('kue'),
  jobs    = kue.createQueue();

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
      var random = Math.round(Math.random() * 2);
      // reduce payload
      if (random === 1) {
        var updates = request.payload, update, i;

        if (typeof updates === 'object') {
          for (i = 0; i < updates.length; i++) {
            update = updates[i];

            // left for debugging using logs
            console.log(update);
            jobs.create('get_image', update)
              .attempts(3)
              .backoff(true)
              .removeOnComplete()
              .save();
          }
        }

      }

      reply('ok');
    }
  });
}

module.exports = {
  setupRoutes: setupRoutes
};
