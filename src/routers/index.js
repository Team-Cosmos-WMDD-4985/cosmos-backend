import express from 'express';
import * as TopicGenerationController from "../controllers/topicGeneration.js";
const router = express.Router();

import authRoute from './authRoutes.js';

router.get("/test", (req, res)=> {
    res.json({
        message: "This is a test route"
    })
});

// router.get("/gets3", fetchS3Object);
router.post("/addCourse", TopicGenerationController.addCourse);
router.post("/generateTopics", TopicGenerationController.topicGeneration);
router.use(authRoute);


export default router;