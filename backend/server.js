import express from "express";
import dotenv from "dotenv";
import authRoutes from "../backend/routes/auth.route.js";
import { connectDB } from "./lib/db.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
// authorization
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

//eSYgVUY4qLKDcE9s
//titorefat76
