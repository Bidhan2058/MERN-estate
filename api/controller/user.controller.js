const Listing = require("../Model/listing.model");
const User = require("../Model/user.model");
const errorHandler = require("../utils/error");
const bcrypt = require("bcryptjs");

const test = (req, res) => {
  res.send("in the server api/user");
};

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can delete only your own account"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("user deleted successfully!!");
  } catch (err) {
    next(err);
  }
};

const getUserListing=async(req,res,next)=>{
 
   if(req.user.id===req.params.id){
   try{
      const listings = await Listing.find({userRef:req.params.id})
      res.status(200).json(listings)
   }catch(error){
    next(error);
   }
   }else{
    return next(errorHandler(401,'you can only view your own listing'))
   }
 
}

module.exports = { test, updateUser, deleteUser, getUserListing };
