const restify = require('restify');
const port = 5050 || process.env.PORT;

function status(req, res, next) {
  const response = {
    'msg': 'welcome'
  };
  res.send(response);
  next();
}

const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.get('/status', status);

server.listen(port, () => {
  console.log(`${server.name} listening at ${server.url}`);
});