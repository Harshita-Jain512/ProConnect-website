import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from  "./routes/user.routes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(postRoutes)

app.use(userRoutes)
app.use(express.static("uploads"))

const start = async () => {
  try {
    await mongoose.connect("mongodb+srv://HarshitaSaraf:Rashisaraf@linkedinclone.idnisle.mongodb.net/?retryWrites=true&w=majority&appName=LinkedinClone");
    console.log("Connected to MongoDB Atlas");

    app.listen(9080, () => {
      console.log("Server is running on port 9080");
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

start();
