import { createServer } from "http";
import express from "express";

import multer from "multer";
const upload = multer({ dest: './uploads/' });

const mongoose = require("mongoose");
const { ImageEntry, Food } = require("./models.mjs");

const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
 
app.use(express.static("static"));

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.get("/", async (req, res) => {
    return res.json({ message: "Hello, World ✌️" });
});

// app.get("/images", async (req, res) => {
//     const allDogs = await Dog.find();
//     return res.status(200).json(allDogs);
// });
  
// app.get("/images/:", async (req, res) => {
//     const { id } = req.params;
//     const dog = await Dog.findById(id);
//     return res.status(200).json(dog);
// });

export const server = createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
  