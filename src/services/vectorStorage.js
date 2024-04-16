import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings, OpenAI, ChatOpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";

export default {
    saveToVectorStorage : async (docs) => {
        const vectorStorage = await MemoryVectorStore.fromDocuments(
            docs,
            new OpenAIEmbeddings()
        )
        // const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
        return vectorStorage;
    },

    retrieverQAChain: async (vectorStore, question) => {

        const vectorStoreRetriver = vectorStore.asRetriever();
        const model = new OpenAI({
            modelName: "gpt-3.5-turbo",
            // openAIApiKey: process.env.OPENAI_API_KEY
            // openAIApiKey: "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",
            configuration: {
                apiKey: "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"
            }
        })
        const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriver);
    
        const answer1 = await chain.invoke({
            query: question
        });
        return answer1
    }
}