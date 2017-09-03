const jwtUtils = require('./jwtUtils');
const tokenCache = require('./tokenCache');

function status(req, res, next) {
  const response = {
    'msg': 'welcome'
  };
  res.send(response);
  next();
}

async function checkToken(req, res, next) {
  const token = req.headers['x-access-token'];
  const decodedToken = await jwtUtils.decodeToken(token);

  if (decodedToken.error === null) {
    const decodedEmail = decodedToken.data.email;
    const tokenFromStore = await tokenCache.getToken(decodedEmail);
    const doesTokenMatchStore = token === tokenFromStore;
    if (doesTokenMatchStore === true) {
      req.decodedToken = decodedToken;
      return next();
    } else {
      res.send(403, { 
        'msg': 'tokenNonExistant',
        'doesTokenMatchStore': doesTokenMatchStore
      });
    }
  } else {
    res.send(403, { 
      'msg': 'tokenInValid',
      'decodedToken': decodedToken
    });
  }
}

function private(req, res, next) {
  const decodedToken = req.decodedToken;
  const response = {
    'msg': `Token accepted ${decodedToken.data.email}`
  };
  res.send(response);
  next();
}

module.exports = {
  status: status,
  checkToken: checkToken,
  private: private
};