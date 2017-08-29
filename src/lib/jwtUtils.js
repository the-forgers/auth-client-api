const jwt = require('jsonwebtoken');
const fs = require('fs');

const publicCert = fs.readFileSync('auth-gateway-cert.pem');

async function isValidToken(token, emailToVerify) {
  if (token) {
    try {
      const decoded = await jwt.verify(token, publicCert, { algorithms: ['RS512'] });
      if (decoded._doc.email === emailToVerify) {
        return true;
      } else {
        return false;
      } 
    } catch (err) {
      return err.message;
    }
    return true
  } else {
    return false;
  }
}

module.exports = {
  isValidToken: isValidToken
};
