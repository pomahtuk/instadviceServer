var _ = require('underscore'),
        kue = require('kue');


    var jobs = kue.createQueue(),
        q = new kue, // object so we can access exposed methods in the kue lib
        // hours = 24,
        timer = 5 * 60 * 1000; // timer for the setInterval function


    var completedJobs = function(callback) {
      /**
       *  completedJobs - uses the kue lib .complete function to get a list of
       *  all completed job ids, iterates through each id to retrieve the actual
       *  job object, then pushes the object into an array for the callback.
       *
       */
      q.complete(function(err, ids){
        var jobs = [],
            count = 0,
            total = ids.length;
        console.log('completedJobs -> ids.length:%s',ids.length);
        _.each(ids, function(id){
          kue.Job.get(id, function(err, job){
            count++;
            jobs.push(job);
            if (total === count) {
              callback(null, jobs);
              return;
            }
          });
        });
      });
    }

    var removeJobs = function(jobs, callback) {
      /**
       *  removeJobs - removes the job from kue by calling the job.remove from the
       *  job object collected in completedJobs().
       *
       */
      var count = 0,
          total = jobs.length;
      console.log('removeJobs -> jobs.length:%s',jobs.length);
      _.each(jobs, function(job) {
        job.remove(function(err) {
          count++;
          if (total === count) {
            callback(null, count);
            return;
          }
        });
      });
    }

    var dateDiffInDays = function(d1, d2) {
      /**
       *  dateDiffInDays - returns the difference between two Date objects in days
       */
      var t2 = d2.getTime(),
          t1 = d1.getTime();
      return parseInt((t2-t1)/(60*1000));
    }

    setInterval(function() {
      /**
       *  setInterval - calls completedJobs in a 24-hour interval
       */
      completedJobs(function(err, jobs) {
        // callback to completedJobs
        console.log('completedJobs -> callback-> jobs.length:%s', jobs.length);
        var jobsToRemove = [],
            now = new Date();
        _.each(jobs, function(job){
          var then = new Date(parseInt(job.created_at)),
              diff = dateDiffInDays(then, now),
              timePastForRemoval = 10; // remove anything older than 10 minutes
          if (diff >= timePastForRemoval) {
            jobsToRemove.push(job);
          }
        });
        console.log('completedJobs -> callback -> jobsToRemove.length:%s', jobsToRemove.length);
        if (jobsToRemove.length > 0) { // if we have jobsToRemove
          removeJobs(jobsToRemove, function(err, count){
            // callback to removeJobs
            console.log('removeJobs -> callback -> jobs removed:%s',count);
          });
        } else {
          console.log('completedJobs -> callback -> no jobs to remove');
        }
      });
    }, timer);

    console.log('Running kue completed job clean-up');
