import mongoose from "mongoose";

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    },
    courseName: { 
      type: String, 
      required: true 
    },
    startDate: { 
      type: Number, 
      required: true 
    },
    endDate: { 
      type: Number, 
      required: true 
    },
    topics: [String],
    totalNumberOfWeek: { 
      type: Number, 
      required: true 
    },
    pdfFileS3Key: {
      type: String
    },
    s3ImageUrl: {
      type: String
    },
    vectorStoreS3Key: {
      type: String
    },
    schedule: [
      {
        weekName: {
          type: String,
        },
        topics: [String]
      }
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
