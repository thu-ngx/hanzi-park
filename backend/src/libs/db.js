import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_CONNECTION)
      .then((mongoose) => {
        console.log("Connect with database successfully");
        return mongoose;
      })
      .catch((error) => {
        console.log("Error when connecting with database ", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
