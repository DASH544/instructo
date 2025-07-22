import express from "express";
import { addCourse, editCourse, fetchAllCourses } from "../controllers/course.controller.js";
import { auth, isAdmin } from "../middlewares/auth.js";
const router = express.Router();
router.get("/allCourses",fetchAllCourses);
router.post("/addCourse",auth,isAdmin,addCourse);
router.patch("/editcourse/:id",auth,isAdmin,editCourse)
export default router;
