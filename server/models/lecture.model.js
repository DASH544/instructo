import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
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
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    createdBy:
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"users",
      required:true
    },
    length: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const LectureModel = mongoose.model("lectures", lectureSchema);
