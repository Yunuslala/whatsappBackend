import multer from "multer";

//  import fs from "fs";
// import path from "path"

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       const dirPath=path.join(__dirname,"..")
//       const uploadFolder = path.join(dirPath, 'uploadImages');
      
//       console.log(uploadFolder)
//       if(!fs.existsSync(uploadFolder)){
//         fs.mkdirSync(uploadFolder)
//       }
//       cb(null, uploadFolder); // Uploads will be stored in the 'uploads' directory

//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname);
//     },
//   });
  

const storage=multer.memoryStorage()

export  const upload = multer({ storage: storage });


