import asyncHandler from "express-async-handler"
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

 
// @desc    Create new product
// @route   POST /api/v1/product/register
// @access  Private/Admin
export const createProductCtrl = asyncHandler(async(req, res) => {
  console.log(req.file);
  const { name, description, category, sizes, colors, user, price, totalQty,brand } = req.body;

//upload image files
const convertedImgs = req.files.map((file) => file?.path)
//check find product exist
const productExists = await Product.findOne({ name });
 if (productExists) {
  throw new Error("Product is already exists")
}
 //find the brand first
 const brandFound = await Brand.findOne({ name: brand.toLowerCase(), })
 if (!brandFound) {
  throw new Error("Brand not Found. Please  first create brand or check brand name")
}

//find category first
const categoryFound = await Category.findOne({ name: category.toLowerCase(), })
if (!categoryFound) {
  throw new Error("Category not found, please first create category or check category name")
}

//create product
  const product = await Product.create({
  name, 
  description, 
  category, 
  sizes, 
  colors, 
  user: req.userAuthId,
  price, 
  totalQty,
  brand
})
 //push the productId into category
categoryFound.products.push(product._id);
//resave
await categoryFound.save();

//push the prouctId into brand
brandFound.products.push(product._id)
//resave
await brandFound.save();
//response
  res.status(200).json({
    message: "Product Successfully Created",
    product,
  }) 
})


// @desc    Get All products
// @route   POST /api/v1/products/get
// @access  Private/Admin
export const getProductsCtrl = asyncHandler(async(req, res) => {
  //  console.log(req.query);
  
   //query
  let productQuery = Product.find();
   
  //search name product
  if(req.query.name){
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" } 
    })
  }
  //filter  brand product
  if(req.query.brand){
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" } 
    })
  }
   //filter brand category
   if(req.query.category){
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" } 
    })
  }
  //filter colors product
  if(req.query.colors){
    productQuery = productQuery.find({
      colors: { $regex: req.query.colors, $options: "i" } 
    })
  }
  //filter sizes product
  if(req.query.size){
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: "i" } 
    })
  }
  //filter by price range
  if(req.query.price){
    const priceRange = req.query.price.split("-");
    //gte: greater or equal
    //lte: less than or equal to
    productQuery = productQuery.find({
       price: {$gte: priceRange[0], $lte: priceRange[1] }
    })
  }
   //page
   const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
   //limit
   const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
   //startIndex
   const startIndex = (page - 1) * limit;
   //EndIndex
   const endIndex = page * limit;
   //total
   const total = await Product.countDocuments();
  //skip and limit
   productQuery = productQuery.skip(startIndex).limit(limit)

  //Pagination 
  const pagination = {};
  if(endIndex < total){
    pagination.next = {
      page: page + 1,
      limit,
    }
  }
  if(startIndex > 0){
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

   //await query
  const products = await productQuery.populate("reviews");
  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Products Successfully Fetched",
    products,
  });

    
})
   // @desc Get single product
  // @route POST /api/v1/products/:id
 // @access Public

export const getIdProductCtrl = asyncHandler(async(req, res) => {
   
  const product = await Product.findById(req.params.id).populate("reviews")
  if (!product) {
    throw new Error("No Product Found")
  }
  res.json({
    status: "success",
    message: "Product fetched Successfully",
    product,
  })
 })

// @desc    update  product
// @route   PUT /api/products/:id/update
// @access  Private/Admin
export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name, 
    description, 
    category, 
    sizes, 
    colors, 
    user,
    price, 
    totalQty,
    brand
  } = req.body;
  //validation required

  //update
  const product = await Product.findByIdAndUpdate(
    req.params.id,{
      name, 
    description, 
    category, 
    sizes, 
    colors, 
    user,
    price, 
    totalQty,
    brand
    },
    {
      new : true,
      runValidators: true,
    },
  )
  res.json({
    status: "Success",
    message: "Product updated Successfully",
    product,
  })
})

// @desc    delete  product
// @route   PUT /api/products/:id/update
// @access  Private/Admin

export const deleteProductCtrl = asyncHandler(async(req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: "Success",
    message: "Product deleted successfully"
  })
})
