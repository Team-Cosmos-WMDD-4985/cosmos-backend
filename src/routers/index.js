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
    message: "This is a test route for cicd testing",
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
router.post("/updateSchedule", TopicGenerationController.updateCouse);
router.get('/courses/:courseId', AuthMiddleware, TopicGenerationController.getCourseById);
router.get("/chatai/:courseId", AuthMiddleware, TopicGenerationController.chatAI);

// Quizes
router.get("/getQuiz/:courseId", generateQuiz.getQuiz )
router.get('/getQuizByUser', AuthMiddleware, QuizController.getQuizByUser)
router.post("/generateQuiz", AuthMiddleware ,TopicGenerationController.QuizGeneration )
router.get("/getQuiz", AuthMiddleware ,generateQuiz.getQuiz );
router.post("/sendTopics", AuthMiddleware, QuizController.sendTopics);
router.get("/quizById", AuthMiddleware, QuizController.getQuizById)
router.post("/addQuestion/:quizID", AuthMiddleware, QuizController.addQuestion);
router.post("/getQuizForUpdate/:quizId", AuthMiddleware, QuizController.getQuizForUpdate);
router.post("/regenerateQuiz/:quizId/:courseId", AuthMiddleware, QuizController.regenerateQuestion);
router.delete("/deleteQuiz/:quizId", AuthMiddleware, QuizController.deleteQuiz);

export default router;
