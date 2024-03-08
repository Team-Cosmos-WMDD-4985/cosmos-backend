import Quiz from '../models/Quiz.js';

let courseId = "5f4d61b417a3412c28fb3a12";

export const getQuiz = async (req, res) => {
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
