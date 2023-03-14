import mongoose from "mongoose";

const connectDb = async () => {
  
  try{
    const connected = mongoose.connect(process.env.MONGO_URL);
    
    console.log(`CEO Paul Mongodb connected ${(await connected).connection.host}`);
  }
  catch(error){
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDb;

// ceo db
// Qxbf6KJzTTghIVuf

