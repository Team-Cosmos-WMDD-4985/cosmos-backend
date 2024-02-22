import mongoose from "mongoose";

const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz" },
    question: { type: String, required: true },
    options: [
      {
        optionValue: String,
        isTrue: Boolean,
      },
    ],
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
