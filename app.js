const restify = require('restify');
const corsmiddleware = require('restify-cors-middleware');
const server = restify.createServer({
    name: 'hifiapi',
    version: '1.0.0'
});
const logger = require("morgan");
server.use(logger("dev"));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.bodyParser({
    mapParms: true,
    mapFiles: true,
    keepExtensions: true,
    uploadDir: './temp'
 }));
server.use(restify.plugins.jsonp());
const cors = corsmiddleware({
    'origins': ['*'],
    'allowHeaders': ['Authorization', 'userID']
});
server.pre(cors.preflight);
server.use(cors.actual);
require("./routes/index")(server);
server.listen(1337, function () {
    console.log('%s listening at %s', server.name, server.url);
});