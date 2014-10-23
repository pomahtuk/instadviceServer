/* global require, module */

'use strict';

var Mongoose  = require('mongoose'),
	Schema    = Mongoose.Schema;

// The data schema for an event that we're tracking in our analytics engine
var updateSchema = new Schema({
  subscription_id : { type: String, required: false, trim: true },
  object          : { type: String, required: false, trim: true },
  object_id       : { type: String, required: false, trim: true },
  changed_aspect  : { type: String, required: false, trim: true },
  time            : { type: String, required: false, trim: true }
});

var UpdateRecord = Mongoose.model('updateRecord', updateSchema);

module.exports = UpdateRecord;