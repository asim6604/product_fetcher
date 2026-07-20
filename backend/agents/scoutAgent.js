
import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import { tavily } from "@tavily/core"
dotenv.config();

const tavilyTool=tavily({
      maxResults: 5,
  apiKey: process.env.TAVILY_API_KEY,
})
const scoutagent= async()=>{
   

  const response = await tavilyTool.search("men women shirt kurta shalwar kameez pants buy online product price");



 const products=response.results.map(product=>({
     title: product.title,
    url: product.url,
    content: product.content
 }))
return products
}
export { scoutagent };