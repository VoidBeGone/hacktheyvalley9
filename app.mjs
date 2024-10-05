import { createServer } from "http";
import express from "express";
import crypto from 'crypto';
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




//adding the image 
function addingPhotoToDB(imageupload){
  for (let i = 0; i < 3; i++){
    DB.insert(imageupload, function(err,returnvalue){
      if (err) console.log("wompy wompy this image fucking fucked up this many times " + i);
      return returnvalue;
    });
  }
  return -1;
}


app.post("/api/images/",upload.array('picture'), function(req,res,next){ 
  //basically Im assuming right now that the image just need a unique id, as well as the photo
  req.files.forEach(function(file){
      addingPhotoToDB(file,function(returnvalue){
        if (returnvalue === -1){return res.status(500).send("error adding image into database ");}
        return res.redirect("/");
      });
  })
});



//retriving photo from database 
app.get("/api/images/:count", function(req,res,next){
  DB.find.sort({createdAt:-1}).limit(parseInt(req.params.count)).exec(function(err,photos){
    if (err) return res.status(500).send("cannot send image in database");
    return res.json(photos); //returning list of images
  }); 
});

app.get("/api/images/retriving/:imageid", function(req,res,next){
  DB.findOne({_id:imageid}, function(err, photo){
    if (err) return res.status(500).send("cannot retrive image in database");
    res.setHeader('Content-Type', photo.mimetype);
    return res.sendFile(image.path, {root:"./"});
  })
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
  