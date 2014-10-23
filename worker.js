/* global require, console */

'use strict';

var kue = require('kue'),
  jobs  = kue.createQueue(),
  http  = require('http'),
  access_token  = '1';

 /*
{
    "data": [
        {
            "type": "image",
            "users_in_photo": [],
            "filter": "Earlybird",
            "tags": ["snow"],
            "comments": {
                "data": [{
                    "created_time": "1296703540",
                    "text": "Snow",
                    "from": {
                        "username": "emohatch",
                        "username": "Dave",
                        "id": "1242695"
                    },
                    "id": "26589964"
                },
                {
                    "created_time": "1296707889",
                    "text": "#snow",
                    "from": {
                        "username": "emohatch",
                        "username": "Emo Hatch",
                        "id": "1242695"
                    },
                    "id": "26609649"
                }],
                "count": 3
            }
            "caption": {
                "created_time": "1296703540",
                "text": "#Snow",
                "from": {
                    "username": "emohatch",
                    "id": "1242695"
                },
                "id": "26589964"
            },
            "likes": {
                "count": 1,
                "data": [{
                    "username": "mikeyk",
                    "full_name": "Mike Krieger",
                    "id": "4",
                    "profile_picture": "http://distillery.s3.amazonaws.com/profiles/profile_1242695_75sq_1293915800.jpg"
                }]
            },        
            "link": "http://instagr.am/p/BWl6P/",
            "user": {
                "username": "emohatch",
                "profile_picture": "http://distillery.s3.amazonaws.com/profiles/profile_1242695_75sq_1293915800.jpg",
                "id": "1242695",
                "full_name": "Dave"
            },
            "created_time": "1296703536",
            "images": {
                "low_resolution": {
                    "url": "http://distillery.s3.amazonaws.com/media/2011/02/02/f9443f3443484c40b4792fa7c76214d5_6.jpg",
                    "width": 306,
                    "height": 306
                },
                "thumbnail": {
                    "url": "http://distillery.s3.amazonaws.com/media/2011/02/02/f9443f3443484c40b4792fa7c76214d5_5.jpg",
                    "width": 150,
                    "height": 150
                },
                "standard_resolution": {
                    "url": "http://distillery.s3.amazonaws.com/media/2011/02/02/f9443f3443484c40b4792fa7c76214d5_7.jpg",
                    "width": 612,
                    "height": 612
                }
            },
            "id": "22699663",
            "location": null
        }
    ]
}

data.filter(function(singleImage) {
    if (singleImage.created_time > timestamp) {
        return true
    }
    return false
})

*/

jobs.process('get_image', function (job, done) {
  // console.log(job);
  var url = 'https://api.instagram.com/v1/tags/' + job.object_id + '/media/recent?access_token=' + access_token;

  http.get(url, function (response) {
    var images = response.data;

    images = images.filter(function (singleImage) {
      if (singleImage.created_time > job.time && singleImage.location) {
        return true;
      }
      return false;
    });

    if (images.length > 0) {
      images.forEach(function (singleImage) {
        console.log(singleImage);
        // do all staff
      });
    } else {
      done();
    }

    done();

  }).on('error', function (e) {
    console.log('Got error: ' + e.message);
    done();
  });
});