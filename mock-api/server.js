const path = require('path');
const multer = require('multer');

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Servir arquivos estáticos (imagens)
const express = require('express');
server.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Rota para upload de imagem
server.post('/upload', upload.single('foto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhuma imagem enviada' });
  }
  // Retorna a URL da imagem (supondo que a API está rodando na mesma máquina)
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ url: imageUrl });
});

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
