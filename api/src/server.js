import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import productRoutes from "./routes/product.route.js";
import authRoutes from "./routes/auth.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import adminRoutes from "./routes/admin.route.js";
import recommendRoutes from "./routes/recommend.route.js";

const app = express();
app.set("trust proxy", 1);

const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://cho-clo.vercel.app",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

const limiterOptions = {
  standardHeaders: "draft-7",
  legacyHeaders: false,
};

const apiLimiter = rateLimit({
  ...limiterOptions,
  windowMs: 60 * 1000,
  limit: 300,
  message: { message: "Too many requests, please slow down." },
});

const authLimiter = rateLimit({
  ...limiterOptions,
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

//Routing
app.use("/api", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recommend", recommendRoutes);
app.listen(5000, () => console.log("API RUNNING ON PORT 5000"));
