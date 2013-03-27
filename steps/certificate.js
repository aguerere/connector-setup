var selfsigned = require('selfsigned');
var fs = require('fs');
var path = require('path');

module.exports = function (program, info, cb) {
  console.log('The authentication provider needs a valid x509 certificate.');
  program.confirm('Do you want to autogenerate a certificate? ', function (createSelfSigned) {
    if (createSelfSigned) {
      selfsigned.generate({subj: '/CN=' + info.connectionDomain }, function (err, selfSigned) {
        if (err) return cb(err);
        fs.writeFileSync(path.join(process.cwd(), 'certs', 'cert.key'), selfSigned.privateKey);
        fs.writeFileSync(path.join(process.cwd(), 'certs', 'cert.pem'), selfSigned.publicKey);
        console.log('Certificate generated.\n'.green);
        cb();
      });
    } else {
      console.log('answer is no');
      console.log('Copy your public and private key to the certs folder replacing ' + 'cert.key'.grey + ' and ' + 'cert.pem'.grey);
      program.prompt('Press enter to continue: ', function(){ cb(); });
    }
  });
};