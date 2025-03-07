import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
     },
    email: { type: String,
         unique: true, 
         required: true 
        }, 
    password: { type: String, 
        required: true }, 
    role: {
      type: String,
      enum: ["doctor", "nurse", "pharmacist", "receptionist", "lab-technician","Admin"],
      required: true,
    },
    isVerified: {
         type: Boolean,
         default: false
        }, 
    verificationToken:{
        type:Number
    },
    verificationTokenExpiresAt:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetToken:{
        type:String,
    },
    resetTokenExpiresAt:{
        type:Date
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})


const User = mongoose.model("User",userSchema);
export default User;