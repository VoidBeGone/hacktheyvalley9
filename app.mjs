import { createServer } from "http";
import express from "express";

import multer from "multer";
const upload = multer({ dest: './uploads/' });

import mongoose from "mongoose"
import { FridgeSnapModel, FoodModel } from "./models.mjs";

const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
 
app.use(express.static("static"));

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

// create

app.post("/api/fridgesnap", (req, res) => {
    
})

// read

app.get("/api/test", async (req, res) => {
    return res.json({ message: "Hello, World ✌️" });
});

//

// delete

// app.get("/images", async (req, res) => {
//     const allDogs = await Dog.find();
//     return res.status(200).json(allDogs);
// });
  
// app.get("/images/:", async (req, res) => {
//     const { id } = req.params;
//     const dog = await Dog.findById(id);
//     return res.status(200).json(dog);
// });

import {connectDB} from "./db.mjs"


export const server = createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
connectDB().catch((err) => console.log(err));
  