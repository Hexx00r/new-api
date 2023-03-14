import asyncHandler from "express-async-handler"
 
import Category from "../models/Category.js";

 
// @desc    Create new category
// @route   POST /api/v1/product/register
// @access  Private/Admin
export const createCategoryCtrl = asyncHandler(async(req, res) => {
  const { name } = req.body;
  //category exists
  const categoryFound = await Category.findOne({ name });
  //if found 
  if(categoryFound){
    throw new Error("Category is Already exist")
  }
  //create
  const category = await Category.create({
    name: name?.toLowerCase(),
    user: req.userAuthId,
    image: req?.file?.path
  })
  
  res.json({
    status: "Success",
    message: "Category Created Successfully",
    category,
  })
})

// @desc    Get all categories
// @route   POST /api/v1/categories
// @access  Public
export const getAllCategoriesCtrl = asyncHandler(async(req, res) => {
  const categories = await Category.find();
  res.json({
    status: "Success",
    message: "Categories Fetched Successfully",
    categories
  })
})

// @desc    Get one categories
// @route   POST /api/v1/:id
// @access  Public
export const getIdCategoryCtrl = asyncHandler(async(req, res) => {
  const category = await Category.findById(req.params.id)
  // no found
  if(!category){
    throw new Error("Category not exist")
  }
  res.json({
    status: "Success",
    message: "Category successfully fetch",
    category,
  })
})

// @desc    Update categories
// @route   POST /api/v1/:id
// @access  Private/Admin
export const updateCategoryCtrl = asyncHandler(async(req, res) => {
  const { name } = req.body;

//update  
 const category = await Category.findByIdAndUpdate(req.params.id, 
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
    category
  })
})


// @desc    Delete categories
// @route   POST /api/v1/:id
// @access  Private/Admin
export const deleteCategoryCtrl = async(req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  res.json({
    status: "Successful",
    message: "Category Deleted Successfully"
  })
}