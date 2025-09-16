import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import path from "path";
import { fileURLToPath } from "url";

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

// Importamos modelo de productos en vez de ProductManager
import Product from './models/productSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://user_CoderHouse:4vpwU9WnfwHLLy57@cluster-coderhouse-back.k1efd0o.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster-CoderHouse-BackEnd1')
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error al conectar con MongoDB", err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
import Handlebars from 'handlebars';
Handlebars.registerHelper('multiply', (a, b) => a * b);
app.engine('handlebars', engine({
  handlebars: Handlebars
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// WebSockets con Mongo
io.on('connection', async socket => {
  console.log('Cliente conectado');

  // Emitir productos actuales
  const products = await Product.find().lean();
  socket.emit('products', products);

  // Agregar producto
  socket.on('newProduct', async data => {
    await Product.create(data);
    const updatedProducts = await Product.find().lean();
    io.emit('products', updatedProducts);
  });

  // Eliminar producto
  socket.on('deleteProduct', async id => {
    await Product.findByIdAndDelete(id);
    const updatedProducts = await Product.find().lean();
    io.emit('products', updatedProducts);
  });
});

// Servidor
const Port = 8080;
server.listen(Port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${Port}`);
});
