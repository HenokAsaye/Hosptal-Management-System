import mongoose from "mongoose";
const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    role:{
        type:String,
        default:"patient"
    },
    password: {
        type: String,
        required: true
    },
    verificationToken: {
        type: Number,
    },
    verificationTokenExpiresAt: {
        type: Date
    },
    role:{
        type:String,
        enum:['patient'],
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiresAt: {
        type: Date
    },
    address: {
        region: {
            type: String,
        },
        city: {
            type: String
        },
        woreda: {
            type: String
        }
    },
    PaymentStatus: {
        type: String,
        enum: ["Paid", "Not Paid"],
        default: "Not Paid"
    },
    medicalHistory: [{
        diagnosis: { type: String, required: true },
        treatment: { type: String, required: true },
        note: { type: String, required: true },
        addedAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});
const Patient = mongoose.model("Patient",patientSchema);
export default Patient;