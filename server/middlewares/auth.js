import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
export const auth = async (req, res, next) => {
  try {
    const { token } = res.cookies;
    if (!token) {
      return res.status(403).json({ message: "Please Login Again" });
    }
    const decodedData = jwt.verify(token, process.env.JWT.SECRET);
    req.user = decodedData.userId;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user;
    const user = await UserModel.findById(userId);
    if (user.role != "admin") {
      return res.status(403).json({ message: "Unauthorized", error });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Unauthorized", error });
  }
};
