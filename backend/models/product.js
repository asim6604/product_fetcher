import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  title: { type: String },
  url: { type: String },
  content: { type: String },
  category: { type: String },
  createdAt: { type: Date, default: Date.now }
})

const Product = mongoose.model("Product", productSchema)

export { Product }