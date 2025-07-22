import mongoose from "mongoose";
import { DB_NAME } from "../index.js";
export const connectionDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}${DB_NAME}`
    );
    console.log(connectionInstance.connection.host);
  } catch (error) {
    console.log("MongoDb ConnectionError:", error);
  }
};
