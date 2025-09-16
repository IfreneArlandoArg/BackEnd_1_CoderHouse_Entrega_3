import { Router } from "express";
import Cart from "../models/cartSchema.js";

const router = Router();

// GET con populate
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product");
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});

// DELETE un producto
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    await Cart.updateOne(
      { _id: cid },
      { $pull: { products: { product: pid } } }
    );
    res.json({ status: "success", message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

// PUT todos los productos
router.put("/:cid", async (req, res) => {
  try {
    await Cart.updateOne(
      { _id: req.params.cid },
      { products: req.body.products }
    );
    res.json({ status: "success", message: "Carrito actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar carrito" });
  }
});

// PUT cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    await Cart.updateOne(
      { _id: cid, "products.product": pid },
      { $set: { "products.$.quantity": quantity } }
    );
    res.json({ status: "success", message: "Cantidad actualizada" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar cantidad" });
  }
});

// DELETE todos los productos
router.delete("/:cid", async (req, res) => {
  try {
    await Cart.updateOne(
      { _id: req.params.cid },
      { products: [] }
    );
    res.json({ status: "success", message: "Carrito vaciado" });
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
});

export default router;
// POST agregar producto a carrito
router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    const prodIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (prodIndex !== -1) {
      cart.products[prodIndex].quantity += Number(quantity);
    } else {
      cart.products.push({ product: pid, quantity: Number(quantity) });
    }
    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al agregar producto al carrito' });
  }
});
