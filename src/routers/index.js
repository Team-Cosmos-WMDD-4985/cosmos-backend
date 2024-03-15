import express from "express";
import multer, { memoryStorage } from "multer";
import authRoute from "./authRoutes.js";
import * as TopicGenerationController from "../controllers/topicGeneration.js";
import * as getQuiz from "../controllers/generateQuiz.js";
import multerConfig from "./../services/multer.js";
import AuthMiddleware from "./../middleware/authTokenRequired.js";
import * as QuizController from "./../controllers/getQuiz.js";
import * as generateQuiz from "../controllers/generateQuiz.js"

const router = express.Router();
const upload = multer({ storage: multerConfig.multerConfig() });

router.get("/test", (req, res) => {
  res.json({
    message: "This is a test route",
  });
});

//Authentication
router.use("/auth" ,authRoute);

// router.get("/gets3", TopicGenerationController.topicGeneration);

// Courses 
router.get("/courses", AuthMiddleware, TopicGenerationController.getCourses);
router.post("/addCourse", AuthMiddleware, upload.single("file"), TopicGenerationController.addCourse);
router.post("/generateTopics", TopicGenerationController.topicGeneration);
// router.post("/generateQuiz", TopicGenerationController.QuizGeneration )

router.use("/auth" ,authRoute);

// Quizes
router.get("/getQuiz/:courseId", generateQuiz.getQuiz )
router.get('/getQuizByUser', AuthMiddleware, QuizController.getQuizByUser)
router.post("/generateQuiz", AuthMiddleware ,TopicGenerationController.QuizGeneration )
router.get("/getQuiz", AuthMiddleware ,generateQuiz.getQuiz );
router.post("/sendTopics", AuthMiddleware, QuizController.sendTopics);

export default router;
