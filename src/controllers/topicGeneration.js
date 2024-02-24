import loadPdf from "../services/loadPdf.js";
import VectorStoreService from "../services/vectorStorage.js";
import AwsService from "../services/aws.service.js"

export const topicGeneration = async (req, res, next) => {

    const splittedDocument = await loadPdf.LoadPDF();
    const vectorStore = await VectorStoreService.saveToVectorStorage(splittedDocument);

    const key = await AwsService.putToS3(vectorStore, true);
    console.log(key)
    // const directory = "/Users/yinka/Documents/art/OPENAI-PDF-CHATBOT/";
    // await vectorStore.save(directory);

    const question = "";
    const response = await VectorStoreService.retrieverQAChain(vectorStore, question);

    console.log(response);

    return res.json({
        sucess: "true"
    })
}


export const fetchS3Object = async (req, res, next) => {
    
    const key = req.query.key;
    const data = await AwsService.getSingleObject(key, false);
    return res.json({
        data
    })
}

export const addCourse = async (req, res, next) => {
    try {

        

    } catch (err) {
        next(err);
    }
}