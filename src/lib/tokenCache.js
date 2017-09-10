/**
 * Handles all token of cache management
 * @module tokenCache
 */

const redis = require("redis");
const client = redis.createClient();

client.on('connect', (err, data) => {
  console.log('Connected to Redis');
});

client.on('error', (err, data) => {
  if (err.code === 'ECONNREFUSED') {
    console.error('Lost connection to Redis');
  } else {
    console.error(`An error with code: ${err.code} occurred`);
    console.error(err);
  }
});

const TOKEN_EXPIRATION_TIME = 1200 //in seconds

/**
 * Allows tokens to be saved to a key-value cache. The users email is the key and the token is the value.
 * @param {string} email  Email address of the user as the key
 * @param {string} token  JWT token to be stored
 * @returns {void}
 */
function saveToken(email, token) {
  client.set(email, token, 'EX', TOKEN_EXPIRATION_TIME);
}

/**
 * Retrieves a token from the key-value cache given the key
 * @async
 * @param {string} key  Unique key to get corresponding value
 * @returns {Promise}   Of whether a value was found or not
 */
function getToken(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
}

/**
 * Returns the remaining time to live (TTL, or expiration) of a key and it's corresponding value in seconds
 * @async
 * @param {string} key  Unique key to get corresponding value
 * @returns {Promise}   Of whether a TTL for the key was found or not
 */
function getTTL(key) {
  return new Promise((resolve, reject) => {
    client.ttl(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
}

/**
 * Determines if a key exists in the key-value cache
 * @async
 * @param {string} key   Unique key to determine existence of
 * @returns {Promise}    Of whether the key was found or not
 */
function doesKeyExist(key) {
  return new Promise((resolve, reject) => {
    client.exists(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
}

/**
 * Makes a key and it's corresponding value expire immediately
 * @param {*} key   Unique key to expire
 * @returns {void}
 */
function expireTokenImmediately(key) {
  client.expire(key, 0);
}

module.exports = {
  saveToken: saveToken,
  getToken: getToken,
  getTTL: getTTL,
  doesKeyExist: doesKeyExist,
  expireTokenImmediately: expireTokenImmediately
}