const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom route for login
server.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const db = router.db; // lowdb instance
  const produtor = db.get('produtores').find({ email, senha }).value();

  if (produtor) {
    res.json(produtor);
  } else {
    res.status(404).json({ message: 'E-mail ou senha inválidos!' });
  }
});

// Add custom routes from routes.json
const routes = require('./routes.json');
server.use(jsonServer.rewriter(routes));

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});
