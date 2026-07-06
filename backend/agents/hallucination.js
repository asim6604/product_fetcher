import { ChatGroq } from "@langchain/groq"
import dotenv from "dotenv"
dotenv.config()
const groq=new ChatGroq({
    apiKey:process.env.GROQ_API_KEY,
    model:"llama-3.3-70b-versatile"
})
const hallucinationAgent=async(products)=>{
const verifield=await Promise.all(
    products.map(async(item)=>{
        const category=await groq.invoke(` i am passing You the object to check if the category is rightly assigned  Look at this product title: "${item.title}"
  Choose only one: shirts, kurta, pants, shoes, other
  Reply with only the category name, nothing else. If the category is wrong then correct it otherwise return the same category name`)
   console.log(`Original: ${item.category} → Verified: ${category.content.trim().toLowerCase()}`)
  const correct={
    ... item,
    category:category.content.trim().toLowerCase()
  }
  return correct
    })
  
)
return verifield
}
export {hallucinationAgent};