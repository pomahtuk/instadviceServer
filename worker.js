/* global require, console */

'use strict';

var kue = require('kue'),
  jobs  = kue.createQueue(),
  https = require('https'),
  Media = require('./models/media'),
  access_token  = '1427599199.0e68eb0.89a973d91ac14effb6a54b4a371916d6';

jobs.process('get_image', function (job, done) {
  var url = 'https://api.instagram.com/v1/tags/' + job.data.object_id + '/media/recent?access_token=' + access_token;

  https.get(url, function (response) {
    var body = '';

    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function () {
      body = JSON.parse(body);

      console.log(body);

      var images = body.data,
        image;

      if (images) {
        images = images.filter(function (singleImage) {
          if (singleImage.created_time > job.data.time && singleImage.location) {
            return true;
          }
          return false;
        });

        if (images.length > 0) {
          images.forEach(function (singleImage) {
            console.log(singleImage);
            Media.find({ 'id': singleImage.id }, function (err, found) {
              if (err) {
                console.log('Got error: ' + err.message);
              }
              if (found.length === 0) {
                // assume we don't have equal image
                image = new Media(singleImage);
                image.save(function (err, savedImage) {
                  console.log(savedImage._id);
                  return true;
                });
              }
            });
          });
        }
      }

      done();
    });

  }).on('error', function (err) {
    console.log('Got error: ' + err.message);
    done(err);
  });
});