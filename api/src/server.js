import express from "express";
import cors from "cors";
import "dotenv/config";
import productRoutes from "./routes/product.route.js";
import cookieParser from "cookie-parser";



const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000" ,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//Routing
app.use ("/api/products", productRoutes);


app.get("/hello/:name",(req,res) => {
    res.json({message: `Hello, ${req.params.name}!`});
});

app.listen(5000, () => console.log("API RUNNING ON PORT 5000"));