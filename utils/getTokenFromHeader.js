
export const getTokenFromHeader = (req) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  //get token from headers
  if(token === undefined){
    return "No token found in the header"
  }else{
    return token;
  }
}