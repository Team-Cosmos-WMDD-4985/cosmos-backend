import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import { FaissStore } from "langchain/vectorstores/faiss";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { loadQAStuffChain, loadQAMapReduceChain } from "langchain/chains";

export default {
    saveToVectorStorage : async (docs) => {
        const vectorStorage = await MemoryVectorStore.fromDocuments(
            docs,
            new OpenAIEmbeddings()
        )

    
    
        return vectorStorage;
    },

    retrieverQAChain: async (vectorStore, question) => {

        const vectorStoreRetriver = vectorStore.asRetriever();
        const model = new OpenAI({
            modelName:"gpt-3.5-turbo"
        })
        const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriver);
    
        const answer1 = await chain.invoke({
            query: question
        });
        return answer1
    }
}