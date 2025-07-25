import express from "express";
import {
  addCourse,
  addLecture,
  deleteCourse,
  deleteLecture,
  editCourse,
  editLecture,
  fetchAllCourses,
  fetchAllLectures,
} from "../controllers/course.controller.js";
import { auth, isAdmin } from "../middlewares/auth.js";
const router = express.Router();
router.get("/allcourses", fetchAllCourses);
router.post("/addcourse", auth, isAdmin, addCourse);
router.patch("/editcourse/:id", auth, isAdmin, editCourse);
router.delete("/deletecourse/:id", auth, isAdmin, deleteCourse);

//lectures
router.get("/lectures/:id", fetchAllLectures);
router.post("/addlecture/:id", auth, isAdmin, addLecture);
router.post("/editlecture/:id", auth, isAdmin, editLecture);
router.post("/deletelecture/:id", auth, isAdmin, deleteLecture);

export default router;
