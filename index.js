require('colors');

var auth0Url = 'https://login.auth0.com';

var program = require('commander');
var async = require('async');
var request = require('request');
var urlJoin = require('url-join');

//steps
var certificate = require('./steps/certificate');
var configureConnection = require('./steps/configureConnection');
var configFile = require('./steps/configFile');

program
  .version(require('./package.json').version)
  .parse(process.argv);

//iJF1dvIa

var provisioningTicket, info;

async.series([
    function (cb) {
      program.prompt('Please enter the ticket number: ', function (pt) {
        provisioningTicket = pt;
        cb();
      });
    },
    function (cb) {
      request.get({
        url: urlJoin(auth0Url, '/p/', provisioningTicket, '/info')
      }, function (err, response, body) {
        if (err) return cb(err);
        if (response.statusCode == 404) return cb (new Error('wrong ticket'));
        info = JSON.parse(body);
        cb();
      });
    },
    function (cb) {
      console.log('\nWe will guide you to a series of steps to configure an authentication provider linked to ' + info.appName.blue);
      console.log('');
      cb();
    },
    function (cb) {
      certificate(program, info, cb);
    },
    function (cb) {
      configureConnection(program, provisioningTicket, auth0Url, cb);
    },
    function (cb) {
      configFile(info, cb);
    }
  ], function (err) {
    if (err) { 
      console.log(err.message.red);
      return process.exit(2);
    }
    console.log('Done!'.green);
    process.exit(0);
  });