var fs = require('fs');
var path = require('path');


module.exports = function (info, cb) {
  var config = {};

  config["SESSION_SECRET"] = "a1b2c3d4567",
  config["WSFED_ISSUER"] = info.connectionDomain;
  config["SITE_NAME"] = info.connectionDomain;
  config["REALMS"] = {};
  config['REALMS'][info.realm.name] = info.realm.postTokenUrl;

  fs.writeFileSync(path.join(process.cwd(), '/config.json'), JSON.stringify(config, null, 4));

  cb();
};