// import { OpenAI } from "langchain/llms/openai";
// import { FaissStore } from "langchain/vectorstores/faiss";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { loadQAStuffChain, loadQAMapReduceChain } from "langchain/chains";

import loadPdf from "../services/loadPdf.js";
import VectorStoreService from "../services/vectorStorage.js";

export const langChain = async (req, res, next) => {

    const splittedDocument = await loadPdf.LoadPDF();
    const vectorStore = await VectorStoreService.saveToVectorStorage(splittedDocument);
    // const directory = "/Users/yinka/Documents/art/OPENAI-PDF-CHATBOT/";
    // await vectorStore.save(directory);

    const question = "Who is the author of this book ?";
    const response = await VectorStoreService.retrieverQAChain(vectorStore, question);

    console.log(response);

    return res.json({
        sucess: "true"
    })
}