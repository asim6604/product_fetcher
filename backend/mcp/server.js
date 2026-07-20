process.env.DOTENV_QUIET = "true"

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { Product } from "../models/product.js"
import { embeddings, index } from "../agents/embeddings.js"
import { graphapp } from "../pipeline/graph.js"
import mongoose from "mongoose"


await mongoose.connect(process.env.MONGODB_URI)

const server = new McpServer({
  name: "product-aggregator",
  version: "1.0.0"
})

server.tool(
  "search_products",
  { query: z.string() },
  async ({ query }) => {
    const searchVector = await embeddings.embedQuery(query)
    const results = await index.query({
      vector: searchVector,
      topK: 5,
      includeMetadata: true
    })
    return {
      content: [{
        type: "text",
        text: JSON.stringify(results.matches)
      }]
    }
  }
)

server.tool(
  "get_products",
  {},
  async () => {
    const products = await Product.find()
    return {
      content: [{
        type: "text",
        text: JSON.stringify(products)
      }]
    }
  }
)

server.tool(
  "run_pipeline",
  {},
  async () => {
    await graphapp.invoke({})
    return {
      content: [{
        type: "text",
        text: "Pipeline completed successfully"
      }]
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)