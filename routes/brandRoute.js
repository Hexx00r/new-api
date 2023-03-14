import express from "express";
import { createBrandCtrl, deleteBrandsCtrl, getAllBrandCtrl, getIdBrandCtrl, updateBrandsCtrl } from "../controllers/brandController.js";
import isAdmin from "../middleware/isAdmin.js";
import { isLoggedIn } from "../middleware/isLoggedin.js";



const brandRouter = express.Router();

brandRouter.post("/", isLoggedIn,isAdmin, createBrandCtrl)

brandRouter.get("/", getAllBrandCtrl)

brandRouter.get("/:id", getIdBrandCtrl)

brandRouter.put("/:id",isLoggedIn,isAdmin,updateBrandsCtrl)

brandRouter.delete("/:id",isLoggedIn ,deleteBrandsCtrl)

export default brandRouter;