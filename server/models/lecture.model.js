import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    lectureName: {
      type: String,
      required: [true, "Lecture Name is Required"],
    },
    lectureDesc: {
      type: String,
      required: [true, "Lecture Description is Required"],
    },
    lectureVideo: {
      type: String,
      required: [true, "Lecture Video is Required"],
    },
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lectures",
      },
    ],
    lectureOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required:true
    },
    length: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const CourseModel = mongoose.model("users", userSchema);
