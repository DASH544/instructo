import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course Name is Required"],
    },
    courseDesc: {
      type: String,
      required: [true, "Course Description is Required"],
    },
    courseImg: {
      type: String,
      required: [true, "Course Image is Required"],
    },
    ownedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    price: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const CourseModel = mongoose.model("courses", courseSchema);
