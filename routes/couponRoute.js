import express from "express";
import { createCouponCtrl, deleteCouponCtrl, getAllCouponsCtrl, getIdCouponsCtrl } from "../controllers/couponControllers.js";
import { updateOrdersCtrl } from "../controllers/orderController.js";
import isAdmin from "../middleware/isAdmin.js";
import { isLoggedIn } from "../middleware/isLoggedin.js";
isLoggedIn

const couponRouter = express.Router();

couponRouter.post("/", isLoggedIn,isAdmin, createCouponCtrl)
couponRouter.get("/", getAllCouponsCtrl);
couponRouter.get("/:id", getIdCouponsCtrl)
couponRouter.put("/update/", isLoggedIn,isAdmin, updateOrdersCtrl)
couponRouter.delete("/", isLoggedIn,isAdmin, deleteCouponCtrl)

export default couponRouter;