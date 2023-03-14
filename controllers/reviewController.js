import asyncHandler from "express-async-handler";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

// @desc    Create new review
// @route   POST /api/v1/product/register
// @access  Private/Admin
export const createReviewCtrl = asyncHandler(async(req, res) => {
  const { product, message, rating } = req.body
  //1. Find the product ID
   const { productID } = req.params
  //check Product
  const productFound = await Product.findById(productID).populate("reviews")
  if(!productFound){
    throw new Error("Product not found")
  }
  //check if already review this product  
  const hasReviewed = productFound?.reviews?.find((review) => {
    console.log(review);
    return review?.user?.toString() === req.userAuthId?.toString()
  })
  if(hasReviewed){
    throw new Error("You Already Reviewed")
  }
  //create review
  const review = await Review.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId
  })
  //push reviewID into productFound
  productFound.reviews.push(review._id)
  //resave
  await productFound.save();
  res.status(201).json({
    success: true,
    message: "Review Created Successfully"
  })
})