  var winston = require('winston');

  winston.loggers.add('r.geocode', {
    console: {
      level: 'info',
      colorize: 'true',
      label: 'r.geocode',
      json: false
    },
    file: {
      filename: 'r.geocode.log',
      level: 'info',
      json: false
    }
  });
