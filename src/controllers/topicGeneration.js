import Joi from "joi";
import loadPdf from "../services/loadPdf.js";
import VectorStoreService from "../services/vectorStorage.js";
import AwsService from "../services/aws.service.js";
import generateQuizQuestion from "./../services/openai-test.js";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import CourseM from "./../models/Course.js"
import multer from "../services/multer.js";
import JoiServices from "../services/JoiServices.js";
import * as OpenAI2 from "openai";
import { generateSchedule } from "./../services/openai-test.js";

const openai2 = new OpenAI2.default({ apiKey: process.env.OPENAI_API_KEY, });

const courseSchema = Joi.object().keys({
    name: Joi.string().required(),
    startDate: Joi.number().required(),
    endDate: Joi.number().required(),
    file: Joi.any().optional(),
    profileImage: Joi.any().optional()
});

const makeScheduleObject = (data) => {
    let finalData = [];
    if(data.schedule) {
        for(let i = 0; i < data.schedule.length; i++) {
            let obj = {
                weekName: `${i + 1}`,
                topics: data.schedule[i].topics
            }
            finalData.push(obj);
        }

    
    }
    console.log(" this is the finalData: " , finalData)
    return finalData;
    
}

export const topicGeneration = async (req, res, next) => {


    const key = req.query.key;
    const serializedData = await AwsService.getSingleObject(key, true);
    const vectorStorage = new MemoryVectorStore(new OpenAIEmbeddings());
    vectorStorage.memoryVectors = serializedData.memoryVectors;

    const question = "Give me 15 topics from this  document in json ";
    const response = await VectorStoreService.retrieverQAChain(vectorStorage, question);
    console.log(JSON.parse());
    // const schedule 
    
    // if(response.text) {
    //     const topics = response.text;
    //     const question2 = `${topics}.  Given a list of topics separated by commas, your task is to distribute these topics evenly over a period of seven weeks, creating a weekly schedule. Each week should contain a portion of the total topics, with the aim of evenly distributing them throughout the seven weeks. The final output should be organized in JSON format, with each week labeled (week1, week2, ..., week7) and associated with an array of topics for that week. The JSON structure should follow this pattern:
        
    //     {
    //         "week1": { "topics": ["topic1", "topic2", ...] },
    //         "week2": { "topics": ["topic3", "topic4", ...] },
    //         ...
    //         "week7": { "topics": ["lastTopicN"] }
    //     }

    //     Please ensure that the topics are divided as evenly as possible among the weeks. If the total number of topics cannot be evenly divided by seven, distribute the remaining topics across the initial weeks until all topics are allocated
    //     `

    //     const completion = await openai2.chat.completions.create({
    //         messages: [{ role: "system", content: question2 }],
    //         model: "gpt-4",
    //       });

    //     const schedule = completion.choices[0].message.content;
       
    //     return res.json({
    //         sucess: "true",
    //         response: response.text,
    //         schedule: JSON.parse(schedule)
    //     })
    // }
    return res.json({
        sucess: "true",
        response: response
    })
}


export const fetchS3Object = async (req, res, next) => {
    
    const key = req.query.key;
    const data = await AwsService.getSingleObject(key, false);
    return res.json({
        data
    })
}

export const getCourses = async ( req, res, next ) => {
    try {
        const userId = req.user._id;
        const courses = await CourseM.find({ userId : userId }).select('_id courseName startDate endDate s3ImageUrl topics')
        return res.json({
            success: true,
            data: {
                courses
            }
        })
    } catch (err) {
        next(err)
    }
}

export const addCourse = async (req, res, next) => {
    try {
        console.log(req.body)
        if(req.body.startDate) {
            req.body.startDate = (new Date(req.body.startDate)).getTime()
        }
        if(req.body.endDate) {
            req.body.endDate = (new Date(req.body.endDate)).getTime()
        }
        console.log(req.body)
        const validate = await JoiServices.validateBodyAsync(courseSchema, req.body)

        const userId = req.user._id
        const file = req.file;
        const path = req.file.path

        let startD = req.body.startDate;
        let endD  = req.body.endDate;

        if (typeof startD === "string") {
            startD = parseInt(startD)
        }

        if(typeof endD === "string") (
            endD = parseInt(endD)
        )
        const startDate = new Date(startD);
        const endData = new Date(endD);
        const difference = endData - startDate;
        const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
        const weeks = Math.ceil(days/7);

        const splittedDocument = await loadPdf.LoadPDF(req.file.path);
        const question = "Give me 15 topics from this  document in json.";
        const vectorStore = await VectorStoreService.saveToVectorStorage(splittedDocument);
        const response = await VectorStoreService.retrieverQAChain(vectorStore, question);
        
        const serializedData = JSON.stringify({
            memoryVectors: vectorStore.memoryVectors,
        });

        let topics;
        console.log(response.text)
        try {
            topics = JSON.parse(response.text);
        } catch (err) {
            topics = `Create any 15 topics based on ${req.body.name} course `
        }

        if (topics.topics) {
            topics = topics.topics
        } else if (topics.Topics) {
            topics = topics.Topics
        }
        console.log(topics);

        const schedule = await generateSchedule(JSON.stringify(topics), weeks);
        console.log (schedule);
        const finalScheduleFormat = makeScheduleObject( JSON.parse(schedule));
        // const finalScheduleFormat = makeScheduleObject(schedule);

        const vectoreStoreKey = await AwsService.putToS3(serializedData, true);

        const courseData = await new CourseM({
            courseName: req.body.name,
            userId: userId,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            topics: topics,
            vectorStoreS3Key: vectoreStoreKey,
            totalNumberOfWeek: weeks,
            schedule: finalScheduleFormat
        }).save();

        // delete file;
        multer.deleteFile(path);
        return res.json({
            sucess: true,
            data: finalScheduleFormat,
            courseId: courseData._id,
            courseData
        })


    } catch (err) {
        next(err);
    }
}

export const updateCouse = async (req, res, next) => {

    try {

        const courseId = req.body.couseId;

        const updatedData = await CourseM.findOneAndUpdate({ _id: req.body.finalCourseData._id }, {schedule: req.body.finalCourseData.schedule});
        console.log(updatedData)
        return res.json({
            updatedData
        })

    } catch (err) {
        next (err)
    }
    
}

export const QuizGeneration = async (req, res, next) => {
    const data = await generateQuizQuestion();
    return res.json({
        data
    })
}