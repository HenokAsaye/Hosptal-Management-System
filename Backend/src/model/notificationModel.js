import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String,
     unique: true,
      required: true
     },
  receiverId: { type: mongoose.Schema.Types.ObjectId,
     ref: "Patient",
    required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId,
     ref: "Appointment"
     }, 
  type: {
    type: String,
    enum: ["appointment_rescheduled", "appointment_cancelled", "appointment_confirmation"],
    required: true,
  },
  message: { type: String,
     required: true }
     , 
  scheduledTime: { type: Date,
     required: true 
    }, 
  sent: { type: Boolean,
     default: false 
    }, 
  createdAt: { type: Date,
     default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;