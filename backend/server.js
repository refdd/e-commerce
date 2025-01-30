import express from "express";
import dotenv from "dotenv";
import authRoutes from "../backend/routes/auth.route.js";
import productsRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cartRoutes.route.js";
import couponsRoutes from "./routes/coupons.route.js";
import PaymentRoutes from "./routes/payment.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const PORT = process.env.POR || 5000;
// middleware
app.use(express.json());
app.use(cookieParser());
// authorization
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/payments", PaymentRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

//eSYgVUY4qLKDcE9s
//titorefat76
