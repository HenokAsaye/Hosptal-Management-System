import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Patient",
        required:true
    },
    doctorId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "User", 
         required: true 
    },
    timeSlot: { type: Date,
         required: true 
    },
    status: { type: String,
         enum: ["scheduled", "completed", "cancelled"], 
         required: true },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { type: Date, 
        default: Date.now 
    },
})


const Appointment = mongoose.model("Appointement",appointmentSchema);
export default Appointment;