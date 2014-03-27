var log = require("./cmnlog");
var winston = require('winston');
var logger = winston.loggers.get('r.geocode');


var restify = require('restify');
var bunyan = require('bunyan');

var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.requestLogger());

var api = require('./api.js');

function sendErrMsg(msg, req, res, next )
{
  logger.error("error: " + msg);
  res.send(
    { 
      'error' : msg
    }
  );
  next();
}

function getGeoCode(req, res, next) {
  logger.info(JSON.stringify(req.params))
  var address = req.params.addr;
  api.getGeoCode(address, function(err, data){
    if( !err ){
      res.send(data);
    }
    else{
      res.send(err);
    }
  });
  next();
}


// Set up our routes and start the server
server.get(  {path: '/geocode', version:'1.0.0'}, getGeoCode);


/* uncomment it if we need audit logger for the traffic through the rest.
server.on('after', restify.auditLogger({
        body: true,
        log: bunyan.createLogger({
                name: 'audit',
                stream: process.stdout
        })
}));
*/
function unknownMethodHandler(req, res) {
  if (req.method.toLowerCase() === 'options') {
      logger.info('received an options method request');
    var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With']; // added Origin & X-Requested-With

    if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
    res.header('Access-Control-Allow-Methods', res.methods.join(', '));
    res.header('Access-Control-Allow-Origin', req.headers.origin);

    return res.send(204);
  }
  else
    return res.send(new restify.MethodNotAllowedError());
}

server.on('MethodNotAllowed', unknownMethodHandler);

server.listen(8087, function() {
  logger.info(server.name + ' listening at ' + server.url + ', love & peace');
});
