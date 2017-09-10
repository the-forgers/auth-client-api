const restify = require('restify');
const port = 5050 || process.env.PORT;

const routeController = require('./lib/routeController');
const server = restify.createServer();

server.use(restify.plugins.bodyParser());
server.get('/status', routeController.status);
server.use(routeController.checkToken);
server.get('/me', routeController.me);

server.listen(port, () => {
  console.log(`${server.name} listening at ${server.url}`);
});