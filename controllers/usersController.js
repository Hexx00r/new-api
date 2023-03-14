import User from "../models/User.js";
import asyncHandler from "express-async-handler"
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

 
// @desc    Register user
// @route   POST /api/v1/users/register
// @access  Private/Admin
export const registerUserCtrl = asyncHandler (async (req, res) => {
  const { fullname, email, password } = req.body
  //check user exists
  const userExists = await User.findOne({ email })
  if(userExists){
    //throw error
    throw new Error("User already exists")
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //create the user 
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  })
   res.status(201).json({
    message: "User Registered Successfully",
    data: user,
  
   })  
 })

 export const loginUserCtrl = asyncHandler(async(req, res) => {
  const { email, password } = req.body
  //find the user in db email only
  const userFound = await User.findOne({
    email,
  })
  if (userFound && await bcrypt.compare(password, userFound?.password)) {
    res.status(200).json({
      msg: "You login Successfuly",
      userFound,
      token: generateToken(userFound?._id)
    })
  }else{
    throw new Error("Invalid Login Credentials")
  }
})

// @desc    Get users profile
// @route   POST /api/v1/users/profile
// @access  Private/Admin
export const getUserProfileCtrl = asyncHandler (async(req, res) => {
 //find the user
 const user = await User.findById(req.userAuthId).populate("orders");
 //response
 res.json({
    status: "Success",
    msg: "User Profile fetch successfully",
    user
 })
  
})

// @desc    Get user's shipping address
// @route   POST /api/v1/users/shipping
// @access  Private/Admin
export const updateShippingAdrdessCtrl = asyncHandler(async(req, res) => {
  const { firstName, 
    lastName, 
    address, 
    city, 
    postalCode, 
    province, 
    country,
    phone 
  } = req.body;

  const user = await User.findByIdAndUpdate(req.userAuthId, {
    shippingAddress: {
    firstName, 
    lastName, 
    address, 
    city, 
    postalCode, 
    province, 
    country,
    phone 
    },
     hasShippingAddress: true,
  },
  {
    new: true
  })
   //send response
   res.json({
    status: "Success",
    message: "User Shipping address updated successfully",
    user
   })
})