var urlJoin = require('url-join');
var request = require('request');
var fs = require('fs');
var path = require('path');

var pemToCert = function(pem) {
  var cert = /-----BEGIN CERTIFICATE-----([^-]*)-----END CERTIFICATE-----/g.exec(pem.toString());
  if (cert.length > 0) {
    return cert[1].replace(/[\n|\r\n]/g, '');
  }

  return null;
};

module.exports = function (program, ticket, auth0Url, cb) {
  program.prompt('Enter the public facing url for this authentication provider (default: http://localhost:4000): ', function (publicUrl) {
    publicUrl = publicUrl || 'http://localhost:4000';

    var signInEndpoint = urlJoin(publicUrl, '/wsfed');
    var cert = pemToCert(fs.readFileSync(path.join(process.cwd(), 'certs', 'cert.pem')).toString());

    request.post({
      url: urlJoin(auth0Url, '/p/custom/', ticket),
      json: {
        certs:          [cert],
        signInEndpoint: signInEndpoint
      }
    }, function (err, response, body) {
      if (err) return cb(err);
      if (response.statusCode !== 200) return cb(new Error(body));
      cb();
    });

  });
};