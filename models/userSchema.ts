import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"], // Sends message if name is not implemented
        unique: true, //unique auto index by default
        trim: true
    },
    displayName: {
        type: String,
        required: [true, "Display name is required"],
        trim: true
    }, 
    },
    { timestamps: true }
)

userSchema.index({ username: 1 }, { unique: true })

// The name of the collection always has to start in capital 
export default mongoose.model("User", userSchema)