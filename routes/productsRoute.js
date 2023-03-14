import express from "express";
import upload from "../config/fileUpload.js";
import { createProductCtrl,deleteProductCtrl,getIdProductCtrl, getProductsCtrl, updateProductCtrl } from "../controllers/productController.js";
import isAdmin from "../middleware/isAdmin.js";
import { isLoggedIn } from "../middleware/isLoggedin.js";


const productRouter = express.Router();

productRouter.post(
  "/", isLoggedIn,
  isAdmin,
  upload.array("files"),
  createProductCtrl);

productRouter.get("/",  getProductsCtrl)

productRouter.get("/:id", getIdProductCtrl)

productRouter.put("/:id", isLoggedIn,isAdmin, updateProductCtrl)

productRouter.delete("/:id", isLoggedIn,isAdmin,deleteProductCtrl)


export default productRouter;