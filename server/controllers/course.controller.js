import express from "express";
import { CourseModel } from "../models/course.model.js";
import { z } from "zod";
import mongoose from "mongoose";
import { LectureModel } from "../models/lecture.model.js";
import { UserModel } from "../models/user.model.js";
export const fetchAllCourses = async (req, res) => {
  try {
    const allCourses = await CourseModel.find();
    return res.status(200).json(allCourses);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getSingleCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: "Invalid Course Id" });
    }
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course Not Found" });
    }
    return res.status(200).json({ message: course });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//zod validation
const courseBody = z
  .object({
    courseName: z.string().min(3).max(32),
    courseDesc: z.string().min(3).max(128),
    courseImg: z.url(),
    price: z.number().min(499).max(9999),
  })
  .strict();

export const addCourse = async (req, res) => {
  try {
    const parsedBody = courseBody.safeParse(req.body);
    if (!parsedBody.success) {
      const validationError = parsedBody.error.issues.map((item) => ({
        field: item.path[0],
        message: item.message,
      }));
      return res.status(400).json({ error: validationError });
    }
    const { courseName, courseDesc, courseImg, price } = parsedBody.data;
    await CourseModel.create({
      courseName,
      courseDesc,
      courseImg,
      price,
      createdBy: req.user,
    });
    return res.status(201).json({ message: "Course Created Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const editCourseBody = courseBody.partial();
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: "Course Not Found Invalid ID" });
    }
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course Not Found" });
    }
    if (course.createdBy.toString() !== req.user.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const parsedBody = editCourseBody.safeParse(req.body);
    if (!parsedBody.success) {
      const validationError = parsedBody.error.issues.map((item) => ({
        field: item.path[0],
        message: item.message,
      }));
      return res.status(400).json({ message: validationError });
    }

    const updatedCourse = await CourseModel.findByIdAndUpdate(
      courseId,
      parsedBody.data,
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(400).json({ message: "Course Not Found" });
    }
    return res.status(200).json({ message: "Course Edited Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Course Not Found Invalid ID" });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course Not Found" });
    }
    const userId = req.user;
    if (course.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const deletedCourse = await CourseModel.findByIdAndDelete(courseId);
    await LectureModel.deleteMany({ course: courseId });
    if (!deletedCourse) {
      return res.status(500).json({ message: "Course could not be deleted" });
    }
    return res
      .status(200)
      .json({ message: "Course deleted successfully", course });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//zod validation
const lectureBody = z
  .object({
    lectureName: z.string().min(3).max(32),
    lectureDesc: z.string().min(3).max(256),
    lectureVideo: z.url(),
    length: z.number(),
  })
  .strict();
export const addLecture = async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: "Course Id is invalid" });
    }
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const userId = req.user;
    if (course.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized req user" });
    }
    const parsedBody = lectureBody.safeParse(req.body);
    if (!parsedBody.success) {
      const validationError = parsedBody.error.issues.map((item) => ({
        field: item.path[0],
        message: item.message,
      }));
      return res.status(400).json({ message: validationError });
    }
    const lecture = await LectureModel.create({
      ...parsedBody.data,
      course: course._id,
      createdBy: userId,
    });
    if (!lecture) {
      return res
        .status(404)
        .json({ message: "Lecture could not be added Please Try again" });
    }
    return res.status(200).json({ message: "Lecture Added Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const editLecture = async (req, res) => {
  try {
    const lectureId = req.params.id;
    const userId = req.user;
    if (!lectureId || !mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(404).json({ message: "Invalid Lecture Id" });
    }
    const lecture = await LectureModel.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture Not Found" });
    }
    if (lecture.createdBy.toString() !== userId) {
      return res.status(404).json({ message: "Unauthorized" });
    }
    const editLectureBody = lectureBody.partial();
    const parsedBody = editLectureBody.safeParse(req.body);
    if (!parsedBody.success) {
      const validationError = parsedBody.error.issues.map((item) => ({
        field: item.path[0],
        message: item.message,
      }));
      return res.status(400).json({ error: validationError });
    }
    const updatedLecture = await LectureModel.findByIdAndUpdate(
      lectureId,
      parsedBody.data,
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Lecture edited successfully", updatedLecture });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const lectureId = req.params.id;
    const userId = req.user;
    if (!lectureId || !mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(404).json({ message: "Invalid Lecture Id" });
    }
    const lecture = await LectureModel.findOne({
      _id: lectureId,
      createdBy: userId,
    });
    if (!lecture) {
      return res.status(404).json({ message: "Lecture Not Found" });
    }
    if (lecture.createdBy.toString() !== userId) {
      return res.status(404).json({ message: "Unauthorized" });
    }
    const deletedLecture = await LectureModel.findByIdAndDelete(lectureId);
    if (!deletedLecture) {
      return res.status(404).json({ message: "Lecture Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Lecture deleted successfully", deletedLecture });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const fetchAllLectures = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid Course Id" });
    }
    const lectures = await LectureModel.find({ course: courseId });
    if (!lectures) {
      return res.status(404).json({ message: "Lectures Not Found" });
    }
    res.status(200).json({ lecturesArr: lectures });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const buyCourse = async (req, res) => {
  try {
    const userId = req.user;
    const courseId = req.params.id;
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: "Course Not Found" });
    }
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course Not Found" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    if (user.subscription.includes(courseId)) {
      return res.status(200).json({ message: "You already own this course" });
    }
    user.subscription.push(course);
    await user.save();
    res.status(200).json({ message: "Course Purchased Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
