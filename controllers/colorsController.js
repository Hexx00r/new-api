import asyncHandler from "express-async-handler";
import Color from "../models/Color.js";

// @desc    Create new Color
// @route   POST /api/v1/brands
// @access  Private/Admin
export const createColorCtrl = asyncHandler(async(req, res) => {
  const { name } = req.body;
  //brand exists
  const colorFound = await Color.findOne({ name });
  //if found 
  if(colorFound){
    throw new Error("Color is Already exist")
  }
  //create brand
  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId
  })
  
  res.json({
    status: "Success",
    message: "Color Created Successfully",
    color,
  })
})

// @desc    Get All Colors
// @route   POST /api/v1/colors
// @access  Public
export const getAllColorsCtrl = asyncHandler(async(req, res) => {
  const colors = await Color.find();
  res.json({
    status: "Success",
    message: "Colors Fetched Successfully",
    colors,
  })
})

// @desc    Get one Color
// @route   POST /api/v1/:id
// @access  Public
export const getIdColorCtrl = asyncHandler(async(req, res) => {
  const color = await Color.findById(req.params.id)
  // no found
  if(!color){
    throw new Error("Colors not exists")
  }
  res.json({
    status: "Success",
    message: "Colors successfully fetch",
    color,
  })
})
 
// @desc    Update Colors
// @route   POST /api/v1/:id
// @access  Private/Admin
export const updateColorsCtrl = asyncHandler(async(req, res) => {
  const { name } = req.body;

//update  
 const colors = await Color.findByIdAndUpdate(req.params.id, 
  {
    name,
  },
  {
    new: true,
  }
  );
  res.json({
    status: "Success",
    message: "Colors Updated Successfully",
    colors,
  })
})


// @desc    Delete Colors
// @route   POST /api/v1/:id
// @access  Private/Admin
export const deleteColorsCtrl = asyncHandler(async(req, res) => {
  const colors = await Color.findByIdAndDelete(req.params.id);
  res.json({
    status: "Successful",
    message: "Colors Deleted Successfully"
  })
})