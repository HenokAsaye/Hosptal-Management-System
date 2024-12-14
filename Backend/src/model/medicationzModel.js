import mongoose,{Schema} from "mongoose";


const medicationSchema =  new mongoose.Schema({
    medicationId:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    expiryDate:{
        type:Number,
        default:0
    },
    prescribedQuantity:{
        type:Number,
        default:0
    },
    despensedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    dispenseDate:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updateAt:{
        type:Date,
        default:Date.now()
    }
})


const Medication = mongoose.model("Medication",medicationSchema);
export default Medication;