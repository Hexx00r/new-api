import express from "express";
import { createColorCtrl, deleteColorsCtrl, getAllColorsCtrl, getIdColorCtrl, updateColorsCtrl } from "../controllers/colorsController.js";
import isAdmin from "../middleware/isAdmin.js";
import { isLoggedIn } from "../middleware/isLoggedin.js";
 
const colorRouter = express.Router();

colorRouter.post("/", isLoggedIn,isAdmin, createColorCtrl)

colorRouter.get("/", getAllColorsCtrl)

colorRouter.get("/:id", getIdColorCtrl)

colorRouter.put("/:id",isLoggedIn,isAdmin, updateColorsCtrl)

colorRouter.delete("/:id",isLoggedIn,isAdmin,deleteColorsCtrl)

export default colorRouter;