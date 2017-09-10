/**
 * Handles all functionality of JWT management
 * @module jwtUtils
*/

const jwt = require('jsonwebtoken');
const fs = require('fs');

const publicCert = fs.readFileSync('auth-gateway-cert.pem');

/**
 * This decodes a given JWT and returns the decoded data or an error
 * @async
 * @param {string} token - The JWT token to decode against the public key
 * @return {Object} Payload object containing the decoded token and any errors that occurred
 */
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
