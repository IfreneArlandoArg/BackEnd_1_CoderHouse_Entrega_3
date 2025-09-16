import { Router } from "express";
import Product from "../models/productSchema.js";

const router = Router();

router.get("/", async (req, res) => {
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
      sort: sortOption
    };

    // usamos paginate
    const result = await Product.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Error en servidor" });
  }
});

export default router;
