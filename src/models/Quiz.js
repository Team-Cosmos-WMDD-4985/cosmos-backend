import mongoose from "mongoose";

const { Schema } = mongoose;

const quizSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    topics: [String],
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
    quizName: { type: String, required: true },
    totalQuestion: {
      type: Number,
    },

    difficulty: {
      type: String
    },
    type : {
      type: String
    },
    questions: [ 
      {
        question: { type: String, required: true },
        questionType: {
          type: String,
        },
        options: [
          {
            optionValue: String,
            isTrue: Boolean,
          },
        ],
        answer: { type: String, required: true },
      }
    ]
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
