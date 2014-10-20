var Hapi    = require("hapi"),
  server    = new Hapi.Server(3000, "localhost"),
  Mongoose  = require('mongoose'),
  mongoURI  = process.env.MONGOLAB_URI ? process.env.MONGOLAB_URI : 'mongodb://localhost/instadvice',
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

// MongoDB Connection
Mongoose.connect(mongoURI);

server.route({
    path: "/",
    method: "GET",
    handler: function(request, reply) {
        reply("Hello, world!");
    }
});

server.route({
  path: "/subscription/",
  method: "GET",
  handler: function(request, reply) {
    reply(request.query['hub.challenge']);
  }
});

server.route({
  path: "/subscription/",
  method: "POST",
  handler: function(request, reply) {
    var updates = request.query;
    if (typeof updates === "array") {
      for (var i = 0; i < updates.length; i++) {
        console.log(updates[i]);
        var record = new UpdateRecord(updates[i]);
        record.save();
        // at this point i should save data
      }
    }
    reply('ok');
  }
});

server.start(function() {
    console.log("Hapi server started @", server.info.uri);
});
