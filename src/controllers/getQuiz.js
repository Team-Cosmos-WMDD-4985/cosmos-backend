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
  console.log(courseId, topics, name, type, difficulty, numQuestions);



  try {
    const topicsString = topics.join(", ");
    console.log(`this is type ${type}`);
    const quizData = await generateQuizQuestion(topicsString, courseId, name, type, difficulty, numQuestions, userId);

    
    quizData.courseId = courseId
    quizData.quizName = name
    quizData.userId = userId;
    quizData.topics = topics;
    quizData.type = type;
    quizData.difficulty = difficulty

    const quiz = new Quiz(quizData);
    const newQuiz = await quiz.save();
    return res.json({
      success: true,
      data: newQuiz
    })
  } catch (err) {
    console.error("Error in sendTopics:", err);
    // next(err);
  }
};


export const regenerateQuestion = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const quizId = req.params.quizId;
    const courseId = req.params.courseId;
    const { type } = req.body;

    console.log(type)
    console.log(courseId, "cid");
    console.log(quizId, "qid");

    if (!quizId) {
      throw new Error("No question id provided");
    }

    const quizDetails = await Quiz.findById(quizId);
    if (!quizDetails) {
      throw new Error("No quiz found");
    }

    const topicsString = quizDetails.topics.join(", ");

    const quizData = await generateQuizQuestion(
      topicsString,
      quizDetails.courseId,
      quizDetails.quizName,
      type,
      quizDetails.difficulty,
      quizDetails.totalQuestion,
      quizDetails.userId
    );

    console.log("thsi is couse id in generate ", quizDetails.courseId)

    if (!quizData.courseId) {
      throw new Error("CourseId is missing in generated quiz data");
    }

    console.log(quizData)


    quizDetails.courseId = quizData.courseId;
    quizDetails.quizName = quizData.quizName;
    quizDetails.userId = userId;
    quizDetails.topics = quizDetails.topics;
    quizDetails.type = quizData.type;
    quizDetails.difficulty = quizData.difficulty;
    quizDetails.questions = quizData.questions;

    // console.log(quizDetails.questions,"this is the questions")
    
    const updatedQuiz = await quizDetails.save();


    if (!updatedQuiz) {
      throw new Error("Failed to save regenerated quiz");
    }

    return res.json({
      success: true,
      data: updatedQuiz
    });
  } catch (err) {
    console.error("Error in regenerateQuestion:", err);
    next(err);
  }
};




export const getQuizByUser = async (req, res, next) => {
  try {

    const quizes = await Quiz.find({ userId: req.user._id })
    return res.json({
      success: true,
      data: quizes
    })
  } catch (err) {
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



export const deleteQuiz = async (req, res, next) => {
  const quizID = req.params.quizID;
  try {
    const deleteQuiz = await Quiz.findOneAndDelete({ quizID: quizID })
    if (!deleteQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.send('Deleted the quiz')
  } catch (err) {
    next(err)
  }
}