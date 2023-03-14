import cloudinaryPackage from "cloudinary";
import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

//configure cloudinary
const cloudinary = cloudinaryPackage.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
});

// Create storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary : cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "blog-api",
  },
});

// Init Multer with the storage engine
const upload = multer({ storage: storage });

export default upload;