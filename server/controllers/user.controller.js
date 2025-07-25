import express from "express";
import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import z, { email } from "zod";
import { CourseModel } from "../models/course.model.js";

const userBody = z
  .object({
    firstName: z.string().min(3).max(32),
    lastName: z.string().min(3).max(32),
    email: z.email(),
    password: z.string(),
  })
  .strict();
export const registerUser = async (req, res) => {
  try {
    const parsedBody = userBody.safeParse(req.body);
    console.log(parsedBody);
    if (!parsedBody.success) {
      const validationError = parsedBody.error.issues.map((item) => ({
        field: item.path[0],
        message: item.message,
      }));
      return res.status(400).json({ error: validationError });
    }
    const { firstName, lastName, email, password } = parsedBody.data;
    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
      const hashedPass = await bcrypt.hash(password, 8);
      await UserModel.create({
        firstName,
        lastName,
        email,
        password: hashedPass,
      });
      return res.status(201).json({ message: "User Registered Successfully" });
    } else {
      return res.status(409).json({ error: "Email Already Exists" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const loginUserBody = userBody.pick({ email: true, password: true });
    const parsedBody = loginUserBody.safeParse(req.body);
    if (!parsedBody.success) {
      const validationError = parsedBody.error.issues.map((item) => ({
        field: item.path[0],
        message: item.message,
      }));
      return res.status(400).json({ error: validationError });
    }
    const { email, password } = parsedBody.data;
    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
      return res.status(404).json({ error: "Please Register First" });
    } else {
      const passwordCheck = await bcrypt.compare(password, userExists.password);
      if (!passwordCheck) {
        return res.status(401).json({ error: "Invalid credentials" });
      } else {
        const token = jwt.sign(
          { userId: userExists._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "15d",
          }
        );
        res.cookie("authToken", token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "Strict",
        });
        return res.status(200).json({ message: "User Logged In Successfully" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      sameSite: "Strict",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Logout failed. Please try again.", errorMsg: error });
  }
};
const passBody = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string(),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  })
  .strict();
export const forgotPass = async (req, res) => {
  try {
    const parsedBody = passBody.safeParse(req.body);
    if (!parsedBody.success) {
      const validationError = parsedBody.error.issues.map((item) => ({
        field: item.path[0],
        message: item.message,
      }));
      return res.status(400).json(validationError);
    }
    const userId = req.user;
    const { oldPassword, newPassword } = parsedBody.data;
    if (!userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized,Please Login First" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(403).json({ message: "Invalid Credentials" });
    }
    const hashedPass = await bcrypt.hash(newPassword, 8);
    user.password = hashedPass;
    await user.save();
    return res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const userProfile = async (req, res) => {
  try {
    const userId = req.user;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json({ message: user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getMyCourses = async (req, res) => {
  try {
    const userId = req.user;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const course = await CourseModel.findById(user.subscription);
    if (!course) {
      return res.status(200).json({ message: "You do not own any courses" });
    }
    return res.json({ message: course });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
