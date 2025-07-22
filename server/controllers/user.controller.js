import express from "express";
import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import z, { email } from "zod";

const userBody = z.object({
  firstName: z.string().min(3).max(32),
  lastName: z.string().min(3).max(32),
  email: z.email(),
  password: z.string(),
});
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
    return res.status(500).json({ error: "Logout failed. Please try again.",errorMsg:error });
  }
};

