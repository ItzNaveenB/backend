const jwt = require('jsonwebtoken')
const multer = require("multer");
const shortid = require("shortid");
// const multerS3 = require("multer-s3");
const path = require("path");
// const aws = require("aws-sdk");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

// const accessKeyId = process.env.accessKeyId;
// const secretAccessKey = process.env.secretAccessKey;

// const s3 = new aws.S3({
//   accessKeyId,
//   secretAccessKey,
// });

exports.upload = multer({ storage });

// exports.uploadS3 = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "flipkart-clone-app",
//     acl: "public-read",
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, shortid.generate() + "-" + file.originalname);
//     },
//   }),
// });

exports.requireSignin = (req, res, next) => {
  if(req.headers.authtoken){
    const token = req.headers.authtoken.split(" ")[1]
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  }else
  return res.status(400).json({message:"Authorization Required"})
  next();
}

exports.userMiddleware = (req,res,next)=>{
 if (req.user.role !== "user")
   return res.status(400).json({ message: "User Access Denied" });
 next();
}

exports.adminMiddleware = (req,res,next)=>{
   if(req.user.role!=='admin') return res.status(400).json({message:'Admin Access Denied'})
  next()
  }

  exports.superAdminMiddleware = (req, res, next) => {
    if (req.user.role !== "super-admin") {
      return res.status(200).json({ message: "Super Admin access denied" });
    }
    next();
  };