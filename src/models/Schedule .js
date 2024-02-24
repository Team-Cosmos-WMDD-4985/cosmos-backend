import mongoose from "mongoose";

const { Schema } = mongoose;

const scheduleSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
    numberOfWeek: { type: Number, required: true },
    topicName: { type: String, required: true },
    outlines: [
      {
        outlineName: String,
        isCompleted: Boolean,
      },
    ],
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
