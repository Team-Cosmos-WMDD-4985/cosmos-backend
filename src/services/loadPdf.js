import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { RetrievalQAChain } from "langchain/chains";
// import { OpenAI } from "@langchain/openai";

// import saveToVectorStorage from "./vectorStorage.js";

const LoadPDF = async () => {
    const loader = new PDFLoader("src/documents/tutorial.pdf");
    const docs = await loader.load();


    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 20,
    });

    const myDocumentSplitted = await splitter.splitDocuments(docs);

    return myDocumentSplitted;
}

export default {
    LoadPDF
}