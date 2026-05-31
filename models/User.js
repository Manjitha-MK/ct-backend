import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "player"],
        default: "player"
    },

    phone: {
        type: String
    },

    profileImage: {
        type: String
    }
},
{
    timestamps: true
}
);

export default mongoose.model("User", userSchema);


/*
    "name": "Manjitha",
    "email": "manjitha@gmail.com",
    "password": "123456",
    "role": "admin"
*/