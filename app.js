const restify = require('restify');
const server = restify.createServer({
    name: 'hifiapi',
    version: '1.0.0'
});

server.use(restify.plugins.bodyParser());
require("./routes/index")(server);
server.listen(1337, function () {
    console.log('%s listening at %s', server.name, server.url);
});