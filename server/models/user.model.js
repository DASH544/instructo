import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Firstname is Required"],
    },
    lastName: {
      type: String,
      required: [true, "Lastname is Required"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    role:
    {
        type:String,
        default:"User"
    },
    subscription:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"courses"
    }]
  },
  { timestamps: true }
);

export const UserModel=mongoose.model("users",userSchema)