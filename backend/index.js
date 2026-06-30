import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cron from "node-cron"
import productRouter from "./routes/route.js"
import { embeddingAgent } from "./agents/embeddings.js"
import { scoutagent } from "./agents/scoutAgent.js"
import { cleanAgent } from "./agents/cleanAgent.js"
import { categorize } from "./agents/categorize.js"
import { publisherAgent } from "./agents/publisherAgent.js"


dotenv.config()

const run = async () => {
  console.log("Pipeline started...")
  const raw = await scoutagent()
  const cleaned = await cleanAgent(raw)
  const categorized = await categorize(cleaned)
  await publisherAgent(categorized)
  const embedded = await embeddingAgent(categorized)
  console.log(embedded)
}

run()

const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/products", productRouter)
cron.schedule("0 */6 * * *", async () => {
  console.log("Running agent pipeline...")
  const raw = await scoutagent()
  const cleaned = await cleanAgent(raw)
  const categorized = await categorize(cleaned)
  await publisherAgent(categorized)
  const embedded = await embeddingAgent(categorized)
console.log(embedded)
  console.log("Pipeline complete!")
})



mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("MongoDB connected")
  app.listen(5000, () => console.log("Server running on port 5000"))
})