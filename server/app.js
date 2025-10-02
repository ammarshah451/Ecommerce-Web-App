import dotenv from "dotenv";
import express from "express";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./configuration/config.js";

import adminRoute from "./routes/admin.js";
import productsRoute from "./routes/products.js";
import userRoute from "./routes/user.js";

import { v2 as cloudinary } from "cloudinary";

import { errorMiddleware } from "./middlewares/error.js";

const app = express();

const PORT = process.env.PORT || 5000;

//using necessary middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Routes importing
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/products", productsRoute);
app.use("/api/v1/user", userRoute);

app.get("/", (req, res) => {
  res.send("Kya hai?");
});

//middleware for error handling
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
