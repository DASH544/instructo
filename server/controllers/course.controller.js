import express from "express";
import { CourseModel } from "../models/course.model.js";
import { z } from "zod";
import mongoose from "mongoose";
import { LectureModel } from "../models/lecture.model.js";
export const fetchAllCourses = async (req, res) => {
  try {
    const allCourses = await CourseModel.find();
    return res.status(200).json(allCourses);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//zod validation
const courseBody = z.object({
  courseName: z.string().min(3).max(32),
  courseDesc: z.string().min(3).max(128),
  courseImg: z.url(),
  price: z.number().min(499).max(9999),
});

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
const lectureBody = z.object({
  lectureName: z.string().min(3).max(32),
  lectureDesc: z.string().min(3).max(256),
  lectureVideo: z.url(),
  length: z.number(),
});
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

export const editLecture = async (req, res) => {};
