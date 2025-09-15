import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager('src/data/products.json');

router.get('/', async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await manager.getProductById(req.params.pid);
  product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
});

router.post('/', async (req, res) => {
  const result = await manager.addProduct(req.body);
  res.status(201).json(result);
});

router.put('/:pid', async (req, res) => {
  const result = await manager.updateProduct(req.params.pid, req.body);
  res.json(result);
});

router.delete('/:pid', async (req, res) => {
  const result = await manager.deleteProduct(req.params.pid);
  res.json(result);
});

export default router;
