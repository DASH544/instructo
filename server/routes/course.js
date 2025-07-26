import express, { Router } from "express";
import {
  addCourse,
  addLecture,
  buyCourse,
  deleteCourse,
  deleteLecture,
  editCourse,
  editLecture,
  fetchAllCourses,
  fetchAllLectures,
  getSingleCourse,
} from "../controllers/course.controller.js";
import { auth, isAdmin } from "../middlewares/auth.js";
const router = express.Router();
router.get("/:id", getSingleCourse);
router.get("/allcourses", fetchAllCourses);
router.post("/addcourse", auth, isAdmin, addCourse);
router.patch("/editcourse/:id", auth, isAdmin, editCourse);
router.delete("/deletecourse/:id", auth, isAdmin, deleteCourse);

//lectures
router.get("/lectures/:id", fetchAllLectures);
router.post("/addlecture/:id", auth, isAdmin, addLecture);
router.post("/editlecture/:id", auth, isAdmin, editLecture);
router.post("/deletelecture/:id", auth, isAdmin, deleteLecture);

//purchase
router.post("/purchase/:id", auth, buyCourse);
export default router;
