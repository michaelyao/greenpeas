var winston = require('winston');
var log = require("./cmnlog");
var logger = winston.loggers.get('r.geocode');

var geocoderProvider = 'google';
var httpAdapter = 'http';
// optionnal
var extra = {
    apiKey: 'YOUR_API_KEY', // for map quest
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = require('./node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);

// Using callback
// geocoder.geocode('29 champs elysée paris', function(err, res) {
//     console.log(res);
// });


function getGeoCode( address, cb) {
  logger.info("address is " + address);
  // Using callback
  geocoder.geocode(address, function(err, res) {
    if(err){
      logger.error("error in api: " + err.message);
      cb(err, null);
    }
    else{
      if( res.length > 0 &&  res[0]['org_result'] && res[0]['org_result']['partial_match']){
        res[0]['partial_match'] = res[0]['org_result']['partial_match'];
      }
      if( res.length > 0 && res[0]['org_result'] && res[0]['org_result']['formatted_address']){
        res[0]['formatted_address'] = res[0]['org_result']['formatted_address'];
      }
      logger.info("geocode response: " + JSON.stringify(res));
      cb(null, res);
    }
  });
}



exports.getGeoCode = getGeoCode;