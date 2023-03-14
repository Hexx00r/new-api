import express from "express";
import { createReviewCtrl } from "../controllers/reviewController.js";
import { isLoggedIn } from "../middleware/isLoggedin.js";
isLoggedIn

const reviewRouter = express.Router();


reviewRouter.post("/:productID", isLoggedIn, createReviewCtrl)

export default reviewRouter;