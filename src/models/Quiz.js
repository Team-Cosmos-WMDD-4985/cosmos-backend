import mongoose from "mongoose";

const { Schema } = mongoose;

const quizSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
    quizName: { type: String, required: true },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
