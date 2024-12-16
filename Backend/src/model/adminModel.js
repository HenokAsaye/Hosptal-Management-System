import  mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
  name: { type: String, 
    required: true 
    },
  email: { type: String, 
    unique: true, 
    required: true
     },
  password: { type: String,
     required: true 
    }, 
  role: { type: String,
     default: "admin" 
    }, 
  permissions: [String], 
  lastLogin: { type: Date }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;