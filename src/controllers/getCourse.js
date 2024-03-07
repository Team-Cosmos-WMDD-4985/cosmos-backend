

import Course from '../models/Course.js';
import authTokenRequired from '../middleware/authTokenRequired.js';




export const getCourse = async (req, res) => {
    const userId = req.user._id;

    try {
        const courses = await Course.find({ userId: userId });
        
        const topicNames = courses.flatMap(course => course.topics.map(topic => topic.topicName));
        for (const topicName of topicNames) {
            await generateQuizQuestion(topicName);
        }
        res.json(courses); 
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
