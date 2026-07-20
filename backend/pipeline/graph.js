import { StateGraph, END } from "@langchain/langgraph"
import { scoutagent } from "../agents/scoutAgent.js"
import { cleanAgent } from "../agents/cleanAgent.js"
import { categorize } from "../agents/categorize.js"
import { hallucinationAgent } from "../agents/hallucination.js"
import { publisherAgent } from "../agents/publisherAgent.js"
import { embeddingAgent } from "../agents/embeddings.js"
const graphState={
    raw:{value:(old,next)=>next??old,default:()=>[]},
    cleaned:{value:(old,next)=>next??old,default:()=>[]},
    categorized: { value: (old, next) => next ?? old, default: () => [] },
    verified: { value: (old, next) => next ?? old, default: () => [] },
    retried: { value: (old, next) => next ?? old, default: () => false }
}
const scoutNode=async(state)=>{
    const raw=await scoutagent();
    return {raw}
}
const cleanerNode=async(state)=>{
    const cleaned=await cleanAgent(state.raw);
      return { cleaned }
}
const categorizerNode = async (state) => {
  const categorized = await categorize(state.cleaned)
  return { categorized,retried:true }
}

const hallucinationNode = async (state) => {
  const verified = await hallucinationAgent(state.categorized)
  return { verified }
}

const publisherNode = async (state) => {
  await publisherAgent(state.verified)
  return {}
}

const embeddingNode = async (state) => {
  await embeddingAgent(state.verified)
  return {}
}

const workflow = new StateGraph({ channels: graphState })
workflow.addNode("scout", scoutNode)
workflow.addNode("cleaner", cleanerNode)
workflow.addNode("categorizer", categorizerNode)
workflow.addNode("hallucination", hallucinationNode)
workflow.addNode("publisher", publisherNode)
workflow.addNode("embedding", embeddingNode)


workflow.setEntryPoint("scout")
workflow.addEdge("scout", "cleaner")
workflow.addEdge("cleaner", "categorizer")
workflow.addEdge("categorizer", "hallucination")
const shouldRetry=(state)=>{
    const bad=state.verified.filter(p=> p.category==="other")
     if (bad.length > 3 & !state.retried) {
   
     
    return "categorizer"
  }
  return "publisher"
}
workflow.addConditionalEdges("hallucination", shouldRetry, {
  "categorizer": "categorizer",
  "publisher": "publisher"
})
workflow.addEdge("publisher", "embedding")
workflow.addEdge("embedding", END)
const graphapp = workflow.compile()

export { graphapp }