/* global require, console */

'use strict';

var kue = require('kue'),
  jobs = kue.createQueue();

// see https://github.com/learnBoost/kue/ for how to do more than one job at a time
jobs.process('get_image', function(job, done) {
  console.log(job.data);
  done();
});