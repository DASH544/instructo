import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectionDB } from "./db/db.js";
const app = express();
const PORT = process.env.PORT;
export const DB_NAME = "instructo";
app.use(express.json());
app.use(cookieParser());
//DATABASE CONNECTION
connectionDB();
//importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
//using routes
app.use("/user", userRoutes);
app.use("/course",courseRoutes);
app.listen(PORT, () => {
  console.log(`Server is runing at http://localhost:${PORT}`);
});
