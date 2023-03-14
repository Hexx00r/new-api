import express from "express";
import categoryFileUpload from "../config/categoryFileUpload.js";
 
import upload from "../config/fileUpload.js";
import { 
  createCategoryCtrl, 
  deleteCategoryCtrl,
  getAllCategoriesCtrl, 
  getIdCategoryCtrl, 
  updateCategoryCtrl } 
  from "../controllers/ categoriesController.js";
 
import { isLoggedIn } from "../middleware/isLoggedin.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/",isLoggedIn,categoryFileUpload.single("file"), createCategoryCtrl);

categoriesRouter.get("/", getAllCategoriesCtrl)

categoriesRouter.get("/:id", getIdCategoryCtrl)

categoriesRouter.put("/:id", isLoggedIn , updateCategoryCtrl)

categoriesRouter.delete("/:id", isLoggedIn, deleteCategoryCtrl)

export default categoriesRouter;