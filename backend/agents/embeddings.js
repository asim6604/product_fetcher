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
const embeddingAgent=async(products)=>{
     console.log("Products received:", products.length) 
    
    await PineconeStore.fromDocuments(
        products.map(item=>({
           pageContent: item.title + " " + item.content,
  metadata: { url: item.url, category: item.category }
        })),
         embeddings,
    { pineconeIndex: index }
    )
     console.log("Products embedded in Pinecone!")
  return "Embeddings stored successfully"
}
export { embeddingAgent }