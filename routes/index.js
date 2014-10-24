/* global require, module, console */

'use strict';

var kue   = require('kue'),
  Media   = require('./models/media'),
  jobs    = kue.createQueue();

function setupRoutes(server) {

  server.route({
    path: '/',
    method: 'GET',
    handler: function (request, reply) {
      Media.count({}, function (err, count) {
        reply('total images: ' + count);
      });
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
      var random = Math.round(Math.random() * 1000);
      // reduce payload, process only 1 request per 1000 done
      if (random === 1) {
        var updates = request.payload, update, i;

        if (typeof updates === 'object') {
          for (i = 0; i < updates.length; i++) {
            update = updates[i];

            jobs.create('get_image', update)
              .attempts(3)
              .backoff(true)
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
