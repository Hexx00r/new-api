import User from "../models/User.js";

const isAdmin = async(req, res, next) => {
  //find the login user
  const user = await User.findById(req.userAuthId);
  //check if admin or CEO
  if (user?.isAdmin) {
    next();
  } else {
    next(new Error("Access Denied, admin/CEO only"))
  }
}

export default isAdmin;