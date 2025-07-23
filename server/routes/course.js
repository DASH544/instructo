import express from "express";
import { addCourse, addLecture, deleteCourse, editCourse, fetchAllCourses } from "../controllers/course.controller.js";
import { auth, isAdmin } from "../middlewares/auth.js";
const router = express.Router();
router.get("/allcourses",fetchAllCourses);
router.post("/addcourse",auth,isAdmin,addCourse);
router.patch("/editcourse/:id",auth,isAdmin,editCourse)
router.delete("/deletecourse/:id",auth,isAdmin,deleteCourse)

//
router.post("/addlecture/:id",auth,isAdmin,addLecture)
export default router;
