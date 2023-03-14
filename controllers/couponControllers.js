import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";
import User from "../models/User.js";


// @desc    Create new Coupons
// @route   POST /api/v1/coupons
// @access  Private/Admin
export const createCouponCtrl = asyncHandler(async(req, res) => {
//destructure payload
const { code, startDate, endDate, discount } = req.body;


 
//check if coupon already exist
const couponExist = await Coupon.findOne({ code })
if (couponExist) {
  throw new Error("Coupon Already exist")
}
//check if discount% is a number
if(isNaN(discount)) {
  throw new Error("Discount must be a number")
} 

//Create Coupon
const coupon = await Coupon.create({
  code: code,
  startDate, 
  endDate, 
  discount, 
  user: req?.userAuthId
})

  res.status(200).json({
    msg: "Coupon Created Successfully",
    coupon
  })

})

// @desc    Get All Coupons
// @route   Get /api/v1/coupons
// @access  Public
export const getAllCouponsCtrl = asyncHandler(async(req, res) => {
  const coupons = await Coupon  .find();

  res.json({
    status: "success",
    msg: "Successfully fetch all coupons",
    coupons
  })
})


// @desc    Get one Coupon
// @route   Get /api/v1/coupons
// @access  Public
export const getIdCouponsCtrl = asyncHandler(async(req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  res.json({
    status: "Success",
    msg: "Successfully get one coupons",
    coupon
  })
})

// @desc    update  Coupon
// @route   put /api/v1/coupons
// @access  Private/Admin
export const updateCouponCtrl = asyncHandler(async(req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
    code: code,
    discount,
    startDate,
    endDate,
  },
  {
    new: true
  }
  )
  res.json({
    status: "Success",
    msg: "Coupon updated",
    coupon
  })
})

// @desc    delete  Coupon
// @route    delete/api/v1/coupons
// @access  Private/Admin
export const deleteCouponCtrl = asyncHandler(async(req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params)
  res.json({
    status: "Success",
    msg: "Coupon deleted",
    coupon
  })
})