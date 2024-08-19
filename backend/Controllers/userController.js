import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Successfully Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select('-password');
    res.status(200).json({ success: true, message: "User found", data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "No user found" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ success: true, message: "Users found", data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};


export const getUserProfile = async(req,res)=>{
  
  const {email} = req.query
  console.log(email)
  try {
    const user = await User.findOne({email:email})
    console.log(user)
    if(!user){
      return res.status(404).json({success:false,message:"user not found"})
    }

    const {password, ...rest} = user._doc

    res.status(200).json({success:true,message:"profile info is getting",data:{...rest}})
  } catch (error) {
    res.status(500).json({success:false,message:"something went wrong,cannot get" });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId });

    const doctorIds = bookings.map((el) => el.doctor._id); // Use doctor._id instead of doctor.id

    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );

    res
      .status(200)
      .json({ success: true, message: "appointments are getting", data: doctors });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "something went wrong, cannot get" });
  }
};
