import mongoose from "mongoose"

const listingSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId, // this field must store the id of another mongo document like a relationship
      ref: "User", // refrences the User model 
      required: [true, "Seller is required"],
      index: true
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "ELECTRONICS",
        "CLOTHING",
        "FURNITURE",
        "BOOKS",
        "OTHER"
      ],
      index: true
    },

    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: [
        "NEW",
        "LIKE_NEW",
        "GOOD",
        "FAIR",
        "POOR"
      ]
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0.01, "Price must be greater than 0"]
    },

    status: {
      type: String,
      enum: ["ACTIVE", "SOLD", "CANCELLED"],
      default: "ACTIVE",
      index: true
    }
  },
  {
    timestamps: true
  }
)

// Required by rubric
listingSchema.index({ category: 1, price: 1 })

// Helpful seller dashboard query
listingSchema.index({ sellerId: 1, createdAt: -1 })

export default mongoose.model("Listing", listingSchema)
