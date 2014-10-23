/* global require, module */

'use strict';

var Mongoose  = require('mongoose'),
    Schema    = Mongoose.Schema;

var mediaSchema = new Schema({
  type            : { type: String, required: false, trim: true },
  filter          : { type: String, required: false, trim: true },
  tags            : [ { type: String, required: false, trim: true } ],
  link            : { type: String, required: false, trim: true },
  created_time    : { type: String, required: false, trim: true },
  images          : [ { type: Schema.Types.Mixed } ],
  id              : { type: String, required: false, trim: true },
  location        : [ { type: Schema.Types.Mixed } ]
});

var Media = Mongoose.model('media', mediaSchema);

module.exports = Media;