import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import express from "express";
import connectDb from "../config/connectDb.js"
import { globalErrorHandler, notFound } from "../middleware/globalErrorHandler.js";
import userRoutes from "../routes/usersRoute.js";
import productRouter from "../routes/productsRoute.js";
import categoriesRouter from "../routes/categoriesRoute.js";
import brandRouter from "../routes/brandRoute.js";
import colorRouter from "../routes/colorRoute.js";
import reviewRouter from "../routes/reviewsRoute.js";
import orderRouter from "../routes/orderRoute.js";
import Order from "../models/Order.js";
import couponRouter from "../routes/couponRoute.js";

 
//db connect
connectDb();
const app = express();
 
//STRIPE WEBHOOK
 const stripe = new Stripe(process.env.STRIPE_KEY)


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_2ea06068243decd7e974f1544246735a2494d04cf13339d0a7e5245e81f70a52";

app.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;
 
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
     

  } catch (err) {
     
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

if (event.type === "checkout.session.completed") {
  //update the order
  const session = event.data.object;
  const { orderId } = session.metadata;
  const paymentStatus = session.payment_status;
  const paymentMethod = session.payment_method_types[0];
  const totalAmount = session.amount_total;
  const currency = session.currency;
   
  //find the order
  
  const order = await Order.findByIdAndUpdate(JSON.parse(orderId), 
    {
    totalPrice: 
    totalAmount /100,
    currency, 
    paymentMethod, 
    paymentStatus
  },
   {
     new: true,
   }
 )
}else{
  return; 
}

//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntentSucceeded = event.data.object;
//       // Then define and call a function to handle the event payment_intent.succeeded
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
response.send();
 });

 
//pass incoming data
app.use(express.json());
//url encoded
 app.use(express.urlencoded({ extended: true }));
//routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productRouter);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandRouter)
app.use("/api/v1/colors/", colorRouter)
app.use("/api/v1/reviews/", reviewRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/coupons", couponRouter)
 
 
//err middleware
app.use(notFound);
app.use(globalErrorHandler);


export default app;