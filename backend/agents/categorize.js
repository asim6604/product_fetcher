import { ChatGroq } from "@langchain/groq"
// missing these two lines at top
import dotenv from "dotenv"
dotenv.config()
const categorize=async (array)=>{
const groq=new ChatGroq({
    apiKey:process.env.GROQ_API_KEY,
    model:"llama-3.3-70b-versatile"
})
const product= await Promise.all(
    array.map(async(item)=>{
        const response = await groq.invoke(`
  Look at this product title: "${item.title}"
  What category does it belong to?
  Choose only one: shirts, kurta, pants, shoes, other
  Reply with only the category name, nothing else.
`)
const category=response.content.trim().toLowerCase();
return{
    ...item,
    category:category
}
    })
)
return product;
}
export {categorize }