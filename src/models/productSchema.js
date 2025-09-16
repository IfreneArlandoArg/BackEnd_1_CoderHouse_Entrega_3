import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";



const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  code: { type: String, unique: true, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: Boolean, default: true },
  thumbnails: [String]
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", productSchema);

export default Product;
