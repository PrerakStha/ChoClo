import express from "express";
import cors from "cors";
import "dotenv/config";
import productRoutes from "./routes/product.route.js";

const app = express();
app.use(cors());
app.use(express.json());

//Routing
app.use ("/api/products", productRoutes);


app.get("/hello/:name",(req,res) => {
    res.json({message: `Hello, ${req.params.name}!`});
});

app.listen(5000, () => console.log("API RUNNING ON PORT 5000"));