import express from "express";
import { registerUserCtrl, loginUserCtrl, getUserProfileCtrl, updateShippingAdrdessCtrl} from "../controllers/usersController.js";
import isAdmin from "../middleware/isAdmin.js";
import { isLoggedIn } from "../middleware/isLoggedin.js";
 
const userRoutes = express.Router();

userRoutes.post("/register", registerUserCtrl )

userRoutes.post("/login", loginUserCtrl)

userRoutes.get("/profile", isLoggedIn,getUserProfileCtrl)

userRoutes.put("/update/shipping",isLoggedIn,isAdmin, updateShippingAdrdessCtrl )

export default userRoutes; 