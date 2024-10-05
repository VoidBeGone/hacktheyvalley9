import { createServer } from "http";
import express from "express";

import { connectDB, addFridgeSnap, pingDB, getFridgeSnaps } from "./db.mjs"


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

//talking with the GOOGLE AI 




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


app.post("/api/documents/",upload.array('picture'), function(req,res,next){ 
  req.files.forEach(function(file) {
      addingPhotoToDB(file,function(returnvalue){
        if (returnvalue === -1){return res.status(500).send("error adding image into database ");}
        return res.redirect("/");
      });
  })
});



//retriving photo from database 
app.get("/api/fridgesnap/:id/images/:count", function(req,res,next){
  DB.find.sort({createdAt:-1}).limit(parseInt(req.params.count)).exec(function(err,photos){
    if (err) return res.status(500).send("cannot send image in database");
    return res.json(photos); //returning list of images
  }); 
});

app.get("/api/images/retriving/:imageid", function(req,res,next){
  DB.findOne({_id:imageid}, function(err, photo){
    if (err) return res.status(500).send("cannot retrieve image in database");
    res.setHeader('Content-Type', photo.mimetype);
    return res.sendFile(image.path, {root:"./"});
  })
});


// create

app.post("/api/fridgesnap/upload", upload.single("picture"), async (req, res) => {
  try {
      const name = req.body.name;
      
      const items = [new FoodModel("pizza", "4")];
      //const items = req.body.items;
      const image_path = req.file ? req.file.path : null;  // Assuming you're saving the path of the uploaded picture
      const uid = 0;

      const fs = new FridgeSnapModel({
          date_added: Date.now(), 
          name: name, 
          food: items,
          uid: uid
      });

      const ret = await addFridgeSnap(fs);  // Assuming addFridgeSnap is a function that saves the document to the database

      res.status(201).json({ message: "FridgeSnap uploaded successfully", data: ret });
  } catch (error) {
      res.status(500).json({ message: "Failed to upload FridgeSnap", error: error.message });
  }
});

// read

app.get("/api/users/:uid/fridgesnaps", async (req, res) => {
    const snaps = getFridgeSnaps(req.params.uid);
    res.json(snaps);
});

app.get("/api/test", async (req, res) => {
    pingDB();
    res.json({ message: "hello" });
})

// 

// delete
export const server = createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);


    connectDB().catch((err) => console.log(err));

});

  