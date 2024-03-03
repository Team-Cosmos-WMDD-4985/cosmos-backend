import express from 'express';
import multer, {memoryStorage} from "multer";
import authRoute from './authRoutes.js';
import * as TopicGenerationController from "../controllers/topicGeneration.js";
import multerConfig from "./../services/multer.js";

const router = express.Router();
const upload = multer({ storage: multerConfig.multerConfig() });

router.get("/test", (req, res)=> {
    res.json({
        message: "This is a test route"
    })
});

router.get("/gets3", TopicGenerationController.topicGeneration);
router.post("/addCourse", upload.single('file'), TopicGenerationController.addCourse);
router.post("/generateTopics", TopicGenerationController.topicGeneration);
router.post("/generateQuiz", TopicGenerationController.QuizGeneration )
router.use("/auth" ,authRoute);


export default router;