import loadPdf from "../services/loadPdf.js";
import VectorStoreService from "../services/vectorStorage.js";
<<<<<<< HEAD
import AwsService from "../services/aws.service.js";
import generateQuizQuestion from "./../services/openai-test.js";
=======
import AwsService from "../services/aws.service.js"
>>>>>>> develop

export const topicGeneration = async (req, res, next) => {

    const splittedDocument = await loadPdf.LoadPDF();
    const vectorStore = await VectorStoreService.saveToVectorStorage(splittedDocument);

    // const key = await AwsService.putToS3(vectorStore, true);
    // console.log(key)
    // const directory = "/Users/yinka/Documents/art/OPENAI-PDF-CHATBOT/";
    // await vectorStore.save(directory);

    const question = "Give me 15 topics from this  document in json.";
    const response = await VectorStoreService.retrieverQAChain(vectorStore, question);

<<<<<<< HEAD
    // console.log(JSON.parse(response.text));

    return res.json({
        sucess: "true",
        response: JSON.parse(response.text)
=======
    console.log(JSON.parse(response.text));

    return res.json({
        sucess: "true",
        response
>>>>>>> develop
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
<<<<<<< HEAD
}

export const QuizGeneration = async (req, res, next) => {
    const data = await generateQuizQuestion();
    return res.json({
        data
    })
=======
>>>>>>> develop
}