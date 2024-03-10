import Quiz from "../models/Quiz.js";
import authTokenRequired from "../middleware/authTokenRequired.js";
import generateQuizQuestion from "../services/openai-test.js";

export const getQuiz = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const quizzes = await Quiz.find({ courseId: courseId }).populate(
      "questions"
    );
    console.log(quizzes);
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const sendTopics = async (req, res) => {
  const { courseId, topics, name, type, difficulty, numQuestions } = req.body;
 console.log(courseId, topics, name, type, difficulty, numQuestions)

  try {
    const topicsString = topics.join(", ");
    const quizTopic = await generateQuizQuestion(topicsString, courseId, name, type, difficulty, numQuestions)
    console.log(topicsString)
  } catch(err){
    console.error("Error in sendTopics:", err);
    res.status(500).send({ error: 'Failed to generate quiz' });
  }
};
