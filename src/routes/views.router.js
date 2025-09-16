
import { Router } from "express";
import Product from "../models/productSchema.js";
import Cart from "../models/cartSchema.js";

const router = Router();

// Home simple (puedes dejarlo o redirigir a /products)
router.get("/", (req, res) => {
  res.redirect("/products");
});

// Vista de productos con paginación
// Middleware para sesión simple en memoria
const userCarts = {};
router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};
    if (query) {
      if (query === "available") filter.status = true;
      else filter.category = query;
    }

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    else if (sort === "desc") sortOption.price = -1;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption,
      lean: true // importante para Handlebars
    };

    // Simulación de sesión por IP (no para producción)
    const userId = req.ip;
    let cartId = userCarts[userId];
    if (!cartId) {
      const newCart = await Cart.create({ products: [] });
      cartId = newCart._id.toString();
      userCarts[userId] = cartId;
    }

    const result = await Product.paginate(filter, options);

    res.render("home", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      currentPage: result.page,
      cartId
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar productos");
  }
});

// Vista de producto individual
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");

    // Obtener o crear el carrito del usuario (igual que en /products)
    const userId = req.ip;
    let cartId = userCarts[userId];
    if (!cartId) {
      const newCart = await Cart.create({ products: [] });
      cartId = newCart._id.toString();
      userCarts[userId] = cartId;
    }

    res.render("productDetail", { product, cartId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar producto");
  }
});

// Vista de un carrito
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) return res.status(404).send("Carrito no encontrado");

    res.render("cartDetail", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar carrito");
  }
});

// Vista realtime (WebSocket)
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
