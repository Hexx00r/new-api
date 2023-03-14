import mongoose from "mongoose";

const Schema = mongoose.Schema;


//Generate random numbers for order
const randomText = Math.random().toString(36).substring(7).toLocaleUpperCase();

const randomNumbers = Math.floor(1000 + Math.random() * 9000) 


const OrderSchema = new Schema(
  {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      type: Object,
      required: true,
    },
  ],
  shippingAddress: {
    type: Object,
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    default: randomText + randomNumbers
  },
  //FOR STRIPES PAYMENT
  paymentStatus: {
    type: String,
    required: true,
    default: "Not Paid"
  },
  paymentMethod: {
    type: String,
    default: "Not specified"
  },
  totalPrice: {
    type: Number,
    default: 0.0
  },
  currency: {
    type: String,
    default: "Not specified"
  },
  //FOR ADMIN/PRIVATE
  status: {
    type: String,
    default: "pending",
    enum: [ "pending", "processing", "shipped", "delivered"],
  }
 }
)

//COMPILE TO FORM MODEL
const Order = mongoose.model("Order", OrderSchema)

export default Order;