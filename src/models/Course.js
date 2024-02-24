import mongoose from "mongoose";

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    courseName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    topics: [
      {
        topicName: String,
        level: { type: String, enum: ["low", "medium", "advance"] },
      },
    ],
    totalNumberOfWeek: { type: Number, required: true },
    vectorStoreS3Key: {
      type: String
    }
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
