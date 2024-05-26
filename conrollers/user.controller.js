import User from "../models/users.model.js";

import bcryptjs from "bcryptjs";
import Listing from "../models/listing.model.js";

export const updateuser = async (req, res) => {
  /* if(req.user.id !== req.params.id){
        return res.status(403).json("You can update only your account!");
    }  */

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
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
    ); //this new true returns for the awaiting variable the updated user
    const { password, ...others } = updatedUser._doc;
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: others,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteuser = async (req, res) => {
  /* if(req.user.id !== req.params.id){
        return res.status(403).json("You can delete only your account!");
    } */

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const getListings = async (req, res, next) => {
  if (/* req.user.id ===  */ req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json({
        success: true,
        listings,
        message: "Listings fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

export const getuser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json({
      success: true,
      user: others,
    });
  } catch (error) {
    next(error);
  }
};
