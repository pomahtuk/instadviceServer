var Hapi = require("hapi");

var server = new Hapi.Server(3000, "localhost");

server.route({
    path: "/",
    method: "GET",
    handler: function(request, reply) {
        reply("Hello, world!");
    }
});

server.start(function() {
    console.log("Hapi server started @", server.info.uri);
});
