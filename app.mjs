import { createServer } from "http";
import express from "express";

import Datastore from "nedb";

import multer from "multer";
const upload = multer({ dest: './uploads/' });





const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
 
app.use(express.static("static"));


app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

// dbs

const FridgeSnapDB = new Datastore({ filename: './db/fridgesnap.db', autoload: true });

//talking with the GOOGLE AI 

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

    console.log(req.body);

    
    const items = [{ name: "pizza", quantity: "4" }];  // Correct instantiation
    //const items = req.body.items;
    const image_path = req.file ? req.file.path : null;  // Assuming you're saving the path of the uploaded picture
    const uid = 0;

    const fridgesnap = { 
      date_added: Date.now(), 
      image: req.file,  
      food: items,
      uid: uid
    }

    FridgeSnapDB.insert( fridgesnap, function(err, img) {
      if (err) {
        res.status(500).json({ message: "Failed to upload FridgeSnap", error: error.message });
      }
      res.status(201).json({ message: "FridgeSnap uploaded successfully", data: fridgesnap });
    })
});

// read

app.get("/api/users/:uid/fridgesnaps", async (req, res) => {
    const snaps = getFridgeSnaps(req.params.uid);
    res.json(snaps);
});

app.get("/api/fridgesnap/:id/image", function(req, res) {
  FridgeSnapDB.findOne({ _id: req.params.id }, function(err, fs){
    if (err) return res.status(500).send("cannot retrieve image in database");
    res.setHeader('Content-Type', fs.image.mimetype);
    return res.sendFile(fs.image.path, {root:"./"});
  })
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
});

  