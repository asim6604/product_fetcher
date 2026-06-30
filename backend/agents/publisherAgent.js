import { Product } from '../models/product.js'
import mongoose from 'mongoose'
import dotenv from "dotenv"
dotenv.config()

await mongoose.connect(process.env.MONGODB_URI)
const publisherAgent=async (array)=>{
await Promise.all(
    array.map(async (item)=>{
   const product= new Product({...item})
   await product.save()
    })
)
return "Products saved successfully"
}

export { publisherAgent }