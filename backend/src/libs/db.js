import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNNECTION);
    console.log("Connect with database successfully");
  } catch (error) {
    console.log("Error when connecting with database ", error);
    process.exit(1);
  }
};
