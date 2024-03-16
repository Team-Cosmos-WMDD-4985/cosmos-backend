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
  const userId = req.user._id;
  const { courseId, topics, name, type, difficulty, numQuestions } = req.body;
 console.log(courseId, topics, name, type, difficulty, numQuestions)

  try {
    const topicsString = topics.join(", ");
    const newQuiz = await generateQuizQuestion(topicsString, courseId, name, type, difficulty, numQuestions, userId)
    console.log(topicsString)
    return res.json({
      success: true,
      data: newQuiz
    })
  } catch(err){
    console.error("Error in sendTopics:", err);
    res.status(500).send({ error: 'Failed to generate quiz' });
  }
};


export const getQuizByUser = async (req, res, next) => {
  try {

    const quizes = await Quiz.find({ userId: req.user._id })
    return res.json({
      success: true,
      data: quizes
    })
  } catch(err){
    next(err)
  }
}

export const getQuizById = async (req, res, next) => {
  try {
    const quizId = req.query.courseId;
    const quizData = await Quiz.findById(quizId);

    if(!quizData) {
      throw new Error("No quiz found");
    }

    return res.json ({
      success: true,
      quiz: quizData
    })
  } catch (err) {
    next()
  }
}
