import mongoose from "mongoose";
export const labResultSchema  = new mongoose.Schema({
    resultId:{
        type:String,
        unique:true,
        required:true
    },
    PatientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required:true
    },
    testName:{
        type:String,
        required:true
    },
    resultDetails:{
        type:String,
        required:true
    },
    technicianId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    isViewAllowed:{
        type:Boolean,
        default:false
    },
    approvedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    cretaedAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
});
const labResult = mongoose.model("labResult",labResultSchema);
export default labResult;