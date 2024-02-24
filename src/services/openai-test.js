import * as OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI.default({ apiKey: process.env.OPENAI_API_KEY });

const quizList = []

async function generateQuizQuestion(topic) {
  try {
    const prompt = `Generate a quiz of 5 question with four options related to ${topic} in html tag.
        <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"> 
        <label for="vehicle3">Option A: </label><br><br>
        <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"> 
        <label for="vehicle3">Option B: </label><br><br>
        <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"> 
        <label for="vehicle3">Option C: </label><br><br>
        <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"> 
        <label for="vehicle3">Option D: </label><br><br>
        Specify the correct answer.`;


    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    quizList.push(completion.choices[0])
    console.log(quizList)
  } catch (error) {
    console.error("Error generating quiz question:", error);
  }
}

const topic = "history, geography, maths";
generateQuizQuestion(topic);
