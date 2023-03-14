import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"
import { verifyToken } from "../utils/verifyToken.js";

 
//Protecting the routes
export const isLoggedIn = (req, res, next) => {
  //Get the token
 const token = getTokenFromHeader(req);
  //Verify the token
 const decodedUser = verifyToken(token);
  //Save the user into req obj
  if(!decodedUser){
    throw new Error("Invalid Token, Please login again")
  }else{
    req.userAuthId = decodedUser?.id;
    next();
  }
   
}
 