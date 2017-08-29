const restify = require('restify');
const port = 5050 || process.env.PORT;

const jwtUtils = require('./lib/jwtUtils')

function status(req, res, next) {
  const response = {
    'msg': 'welcome'
  };
  res.send(response);
  next();
}

async function checkToken(req, res, next) {
  const token = req.headers['x-access-token'];
  const email = req.headers['x-access-email'];
  try {
    const isTokenValid = await jwtUtils.isValidToken(token, email);
    if (isTokenValid === true) {
      return next();
    } else {
      res.send(403, { 
        'msg': 'tokenInValid',
        'error': isTokenValid
      });
    }
  } catch (err) {
    console.error(`An Error occured`);
    console.error(err);
  }
}

function private(req, res, next) {
  const response = {
    'msg': 'this is a private message, for those logged in only'
  };
  res.send(response);
  next();
}

const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.get('/status', status);
server.use(checkToken);
server.get('/private', private);

server.listen(port, () => {
  console.log(`${server.name} listening at ${server.url}`);
});