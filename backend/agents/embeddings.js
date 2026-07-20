import { PineconeStore } from "@langchain/pinecone"
import { CohereEmbeddings } from "@langchain/cohere"
import { Pinecone } from "@pinecone-database/pinecone"
import dotenv from "dotenv"
dotenv.config()
const embeddings=new CohereEmbeddings({
   apiKey: process.env.COHERE_API_KEY,
  model: "embed-english-v3.0",
  inputType: "search_document"
})

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const index = pinecone.index(process.env.PINECONE_INDEX)
const embeddingAgent = async (products) => {


  const texts = products.map(item => item.title + " " + item.content)
  const vectors = await embeddings.embedDocuments(texts)

  


  const records = products.map((item, i) => ({
    id: `product-${Date.now()}-${i}`,
    values: vectors[i],
    metadata: { url: item.url, category: item.category, title: item.title }
  }))

 

  await index.upsert(records)

 
  return "Embeddings stored successfully"
}
export { embeddingAgent, embeddings, index }