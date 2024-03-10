import Quiz from '../models/Quiz.js';

// let courseId = "65ea4f184952e0727466856d";

export const getQuiz = async (req, res) => {
    const courseId = req.params.courseId;
    try {
        const quiz = await Quiz.find({ courseId: courseId });
        if (!quiz) return res.status(404).json('No quizzes found');
        console.log(quiz);
        res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving the quiz.' });
    }
};
