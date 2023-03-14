import asyncHandler from "express-async-handler";
import Brand from "../models/Brand.js";

// @desc    Create new Brand
// @route   POST /api/v1/brands
// @access  Private/Admin
export const createBrandCtrl = asyncHandler(async(req, res) => {
  const { name } = req.body;
  //brand exists
  const brandFound = await Brand.findOne({ name });
  //if found 
  if(brandFound){
    throw new Error("Brand is Already exist")
  }
  //create brand
  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId
  })
  
  res.json({
    status: "Success",
    message: "Brand Created Successfully",
    brand,
  })
})

// @desc    Get All Brands
// @route   POST /api/v1/brands
// @access  Public
export const getAllBrandCtrl = asyncHandler(async(req, res) => {
  const brands = await Brand.find();
  res.json({
    status: "Success",
    message: "Brand Fetched Successfully",
    brands,
  })
})

// @desc    Get one brand
// @route   POST /api/v1/:id
// @access  Public
export const getIdBrandCtrl = asyncHandler(async(req, res) => {
  const brand = await Brand.findById(req.params.id)
  // no found
  if(!brand){
    throw new Error("Brand not exists")
  }
  res.json({
    status: "Success",
    message: "Brand successfully fetch",
    brand,
  })
})

// @desc    Update Brands
// @route   POST /api/v1/:id
// @access  Private/Admin
export const updateBrandsCtrl = asyncHandler(async(req, res) => {
  const { name } = req.body;

//update  
 const brands = await Brand.findByIdAndUpdate(req.params.id, 
  {
    name,
  },
  {
    new: true,
  }
  );
  res.json({
    status: "Success",
    message: "Category Updated Successfully",
    brands,
  })
})


// @desc    Delete Brands
// @route   POST /api/v1/:id
// @access  Private/Admin
export const deleteBrandsCtrl = asyncHandler(async(req, res) => {
  const brands = await Brand.findByIdAndDelete(req.params.id);
  res.json({
    status: "Successful",
    message: "Brand Deleted Successfully"
  })
})
