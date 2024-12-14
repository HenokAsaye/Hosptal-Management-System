import mongoose from "mongoose";


const patientSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
    },
    verificationToken:{
        type:Number,
    },
    verificationTokenExpiresAt:{
        type:Date
    },
    resetToken:{
        type:Numeber,
    },
    resetTokenExpiresAt:{
        type:Date
    },
    address:{
        region:{
            type:String,
        },
        city:{
            type:String
        },
        woreda:{
            type:String
        }
    },
    medicalHistory:{
        type:[String]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
});


const Patient = mongoose.model("Patient",patientSchema);
export default Patient;