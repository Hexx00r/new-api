import Order from "../models/Order.js";
import dotenv from "dotenv";
dotenv.config();
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import Coupon from "../models/Coupon.js";

// @desc    Create new Order
// @route   POST /api/v1/orders
// @access  Private/Admin

//STRIPE INSTANCE
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async(req, res) => {
   

  //Get the payload orderItems, shippingAddress, totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;
  
  //Find the user
   const user = await User.findById(req.userAuthId);

  //Check if the user has shipping address
   if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address")
   }
  
   //check if order is not empty
   if (orderItems?.length <= 0) {
    throw new Error("No Item is found")
   }

   //place or create order - save into DB
   const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice
   })
   console.log(order);

  //Update the product qty and soldout
   const products =  await Product.find({_id:{ $in:orderItems }})
    
   orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id.toString() === order?._id?.toString();
    })
    if (product) {
      product.totalSold += order.qty;
    } 
    await product.save();
   })
    //Push the order into user
    user.orders.push(order?._id)
    await user.save();

  //Make Payment using (Stripe)
  //convert order items to have same structure that stripr need
   const convertedOrders = orderItems.map((item) => {
    return {
        price_data: {
          currency: "usd",
          product_data: {
          name: item?.name,
          description: item?.description,
          },
          unit_amount: item?.price * 100,
        },
        quantity: item?.qty,
      }
   })
//METADATA
   const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?.id)
    },
    mode: "payment",
    success_url: "http://localhost:9000/success",
    cancel_url:  "http://localhost:9000/cancel"
   })
   res.send( {url: session.url })

  //Payment Webhook
  //Update the user's order
   
})

// @desc    Get new Order
// @route   GET /api/v1/orders
// @access  Public
export const getAllOrdersCtrl = asyncHandler(async(req, res) => {

  const orders = await Order.find();
  res.json({
    status: true,
    msg: "Get all orders",
    orders,
  })
})
 

// @desc    Get new Order
// @route   GET /api/v1/orders
// @access  Public
export const getIdOrdersCtrl = asyncHandler(async(req, res) => {
  const order = await Order.findById(req.params.id)
  //no order
  if(!order){
    throw new Error("Order not exist")
  }
  res.json({
    status: "Success",
    msg: "Order Successfully Fetch",
    order
  })
})


// @desc    Update Order
// @route   PUT /api/v1/orders
// @access  Admin
export const updateOrdersCtrl = asyncHandler(async(req, res) => {
  //get id from params
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
  id, 
  {
    status: req.body.status
  },
  {
    new: true,
  }
 )
  res.status(200).json({
    success: true,
    msg: "Updated Order",
    updatedOrder
  })
})

//@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin
export const getOrderStatsCtrl = asyncHandler(async(req, res) => {
  //get sum of total sales
  
  //get orders statistic
  const orders = await Order.aggregate([
    {
       $group: {
        _id: null,
        minSales: {
          $min: "$totalPrice",
        },
        maxSales: {
          $max: "$totalPrice"
        },
        totalSales : {
          $sum: "$totalPrice"
        },
        avgSales : {
          $avg: "$totalPrice"
        },
       }
    }
  ]);
  //get current date
const date = new Date();
const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
console.log(date);
//get sales today
const salesToday = await Order.aggregate([
  {
    $match: {
      createdAt: {
        $gte: today,
      },
    },
  },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice"
        }
      }
    }   
])
  //send response
  res.status(200).json({
    success: true,
    msg: "Sum of orders",
    orders,
    salesToday
  })
})

 
 