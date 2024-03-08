import Quiz from "../models/Quiz.js";
import authTokenRequired from "../middleware/authTokenRequired.js";

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
  const courseId = req.body.courseId;
  console.log(courseId);
  console.log(req.body);
};
