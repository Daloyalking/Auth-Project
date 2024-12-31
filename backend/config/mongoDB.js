import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB");
  }
};
export default ConnectDB;
