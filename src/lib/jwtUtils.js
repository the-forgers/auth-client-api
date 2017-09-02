const jwt = require('jsonwebtoken');
const fs = require('fs');

const publicCert = fs.readFileSync('auth-gateway-cert.pem');

async function decodeToken(token) {
  let payload = {};
  try {
    const decoded = await jwt.verify(token, publicCert, { algorithms: ['RS512'] });
    payload.data = decoded;
    payload.error = null;
    return payload;
  } catch (err) {
    payload.data = null;
    payload.error = err;
    return payload;
  }
}

module.exports = {
  decodeToken: decodeToken
};
