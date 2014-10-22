var Mongoose  = require('mongoose'),
	Schema    = Mongoose.Schema;

// The data schema for an event that we're tracking in our analytics engine
var updateSchema = new Schema({
  subscription_id : { type: String, required: true, trim: true },
  object          : { type: String, required: true, trim: true },
  object_id       : { type: String, required: true, trim: true },
  changed_aspect  : { type: String, required: true, trim: true },
  time            : { type: String, required: true, trim: true }
});

var UpdateRecord = Mongoose.model('updateRecord', updateSchema);

module.exports = {
  UpdateRecord: UpdateRecord
};