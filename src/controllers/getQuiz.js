import Quiz from "../models/Quiz.js";
import authTokenRequired from "../middleware/authTokenRequired.js";
import generateQuizQuestion from "../services/openai-test.js";

export const getQuiz = async (req, res, next) => {
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

export const sendTopics = async (req, res, next) => {
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
    next(err);
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

    console.log(quizDetails.totalQuestion)

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
    quizDetails.totalQuestion = quizDetails.totalQuestion;

    
    
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





export const addQuestion = async (req, res) => {
  const quizID = req.params.quizID;
  const { question, options, answer } = req.body
  console.log(quizID);

  try {
    const quiz = await Quiz.findById(quizID);
    console.log(quiz);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    
     const newQuestion = {
      question: question,
      options:  options.map((option) => ({
        optionValue: option,
      })),
      answer: answer
    }

    quiz.totalQuestion = quiz.totalQuestion +1
    quiz.questions.push(newQuestion);
    console.log(quiz);
    await quiz.save();
    return res.json({
      quiz
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getQuizForUpdate = async (req, res) => {
  const quizID = req.params.quizId;
  try {
      const quiz = await Quiz.findById(quizID);
      if (!quiz) {
          return res.status(404).json({ message: "The requested resource does not exist." });
      }
      return res.status(200).json(quiz);
  } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
  }
};

  