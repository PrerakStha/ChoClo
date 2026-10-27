import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import productRoutes from "./routes/product.route.js";
import authRoutes from "./routes/auth.route.js";
import cartRoutes from "./routes/cart.route.js";

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//Routing
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

app.listen(5000, () => console.log("API RUNNING ON PORT 5000"));
