import Quiz from '../models/quizSchema.js';
import authTokenRequired from '../middleware/authTokenRequired.js';

export const getQuiz = async (req, res) => {
    const courseId = req.params.courseId; 

    try {
        const quizzes = await Quiz.find({ courseId: courseId }).populate('questions');
        res.json(quizzes); 
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
