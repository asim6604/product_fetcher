import express from "express"
import { Product } from "../models/product.js"
import { embeddings, index } from "../agents/embeddings.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const products = await Product.find()
  res.json(products)
})
router.get('/search',async(req,res)=>{
  const {q}=req.query;
const searchVector = await embeddings.embedQuery(q)
  const result=await index.query({
    vector: searchVector,
    topK: 5,
    includeMetadata: true
  })
  res.json(result.matches)
})

export default router