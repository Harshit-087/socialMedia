import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import router from "./router/router.js";
import  connectionDb  from "./db/connection.js";
import dotenv from 'dotenv'
dotenv.config()

const app = express();
connectionDb();

const allowedOrigins = [
  process.env.ORIGIN1,
 process.env.ORIGIN2// your machine's IP for mobile testing
 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["content-type", "authorization"],
  credentials: true
}));



const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

app.use("/", router);

app.listen(5000,"0.0.0.0", () => {
  console.log("Server running on port 5000");
});





//server  as static files ..
// app.use('/uploads', express.static(path.join(_dirname, 'uploads')));




// const storage = multer.diskStorage({ destination: function (req, file, cb) {
//     cb(null, './uploads')
//   }, filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname)  //eg .png or .jpg
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
//   }})
// const upload=multer({storage})

// app.post("/photo",upload.single("pictures"),(req,res)=>{

//    const name=req.file.filename
//    if(name){
//     res.status(200).json({msg:"image uploaded successfully"})
//    }
//    else{
//     res.status(500).json({msg:"internal server error"})
//    }
// })

// app.get("/image",(req,res)=>{
//     const upload_dir=path.join(_dirname,"uploads")
//     fs.readdir(upload_dir,(err,files)=>{
//         if(err){
//             console.log("error in uploading the file ",err.message)
//             res.status(200).json({msg:"internal server error"})
//         }

//         const imageUrl = files.map(file=>`${process.env.BACKEND_URL}/uploads/${file}`)
//         res.status(200).json({msg:"success",imageUrl})
//     })
// })   