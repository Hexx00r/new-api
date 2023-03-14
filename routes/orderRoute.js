import express from "express";
import { createOrderCtrl, getAllOrdersCtrl, getIdOrdersCtrl, getOrderStatsCtrl, updateOrdersCtrl } from "../controllers/orderController.js";
import isAdmin from "../middleware/isAdmin.js";
import { isLoggedIn } from "../middleware/isLoggedin.js";
isLoggedIn

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn,isAdmin, createOrderCtrl);

orderRouter.get("/", getAllOrdersCtrl);

orderRouter.get("/:id", isLoggedIn, getIdOrdersCtrl);

orderRouter.put("/:id", isLoggedIn,isAdmin, updateOrdersCtrl);

orderRouter.get("/sales/stats", isLoggedIn, getOrderStatsCtrl)


export default orderRouter;