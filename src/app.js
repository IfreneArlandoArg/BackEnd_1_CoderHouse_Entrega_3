import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';


import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

import ProductManager from './managers/ProductManager.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

const productManager = new ProductManager('src/data/products.json');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

    

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// WebSockets
io.on('connection', async socket => {
  console.log('Cliente conectado');

  
  socket.emit('products', await productManager.getProducts());

  
  socket.on('newProduct', async data => {
    await productManager.addProduct(data);
    io.emit('products', await productManager.getProducts());
  });

  
  socket.on('deleteProduct', async id => {
    await productManager.deleteProduct(id);
    io.emit('products', await productManager.getProducts());
  });
});

server.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});
