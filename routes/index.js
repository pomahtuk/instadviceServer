/* global require, module, console */

'use strict';

var UpdateRecord  = require('../models/update'),
	kue           = require('kue'),
	jobs          = kue.createQueue();

function setupRoutes (server) {

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
}

module.exports = {
	setupRoutes: setupRoutes
};