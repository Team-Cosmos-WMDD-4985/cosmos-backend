import OpenAI from "openai";
// import * as OpenAI from "openai";
import Quiz from '../models/Quiz.js'

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

const quizList = []

async function generateQuizQuestion(topic) {
  try {
    const prompt = `"Generate a 10 question quiz in JSON format for a basic programming course. The quiz should have a unique identifier for the course with objectId 12 bytes identifier, a name, a total number of questions, and an array of questions. Each question must include the question text, a type (e.g., multiple-choice, true/false), a set of options where applicable (each with a value and a boolean indicating if it's the correct answer), and the correct answer text. The quiz should cover fundamental concepts like variables, control structures, and basic data types. Ensure the structure matches the following mongoose schema:

    courseId (referencing 'Course')
    quizName (string, required)
    totalQuestion (number)
    questions (array) with fields:
    question (string, required)
    questionType (string)
    options (array) with fields:
    optionValue (string)
    isTrue (boolean)
    answer (string, required)
    Please format the output in JSON."
    
    
    `;

    

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });

     const generatedText = completion.choices[0].message.content;
    const generatedQuiz = JSON.parse(generatedText);

    const quiz = new Quiz(generatedQuiz);
    await quiz.save();

    quizList.push(completion.choices[0])
    console.log(generatedQuiz)
    return quizList;
  } catch (error) {
    console.error("Error generating quiz question:", error);
  }
}

const generateSchedule = async (topics, weeks) => {

  console.log(topics)
  const question2 = `${topics}.  Given a list of topics separated by commas, your task is to distribute these topics evenly over a period of ${weeks} weeks, creating a weekly schedule. Each week should contain a portion of the total topics, with the aim of evenly distributing them throughout the ${weeks} weeks. You can split one topics to as many small topics, but make sure that all the weeks get at least 2 topics and one topic occur in once only in the whole schedule. The final output should be organized in JSON format, with each week labeled (week1, week2, ..., week7) and associated with an array of topics for that week. The JSON structure should follow this pattern:
       schedule: { [
          {
            week: "1",
            topics : ["topic1", "topic2"],
          },
          {
            week : "2",
            topics: ["topic3","topic4"]
          }
        ]

      }
        `

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: question2 }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content
}

const topic = "history, geography, maths";
// generateQuizQuestion(topic);
export default generateQuizQuestion;

export {
  generateSchedule
}