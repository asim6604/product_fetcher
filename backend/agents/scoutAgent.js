
import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import { tavily } from "@tavily/core"
dotenv.config();

const tavilyTool=tavily({
      maxResults: 5,
  apiKey: process.env.TAVILY_API_KEY,
})
const scoutagent= async()=>{
    console.log("Scout Agent started — searching for AI news...");

  const response = await tavilyTool.search("clothing");

  console.log("Scout Agent found articles:", response);

 const products=response.results.map(product=>({
     title: product.title,
    url: product.url,
    content: product.content
 }))
return products
}
export { scoutagent };