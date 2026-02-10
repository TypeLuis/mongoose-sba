import mongoose from "mongoose"

const offerSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: [true, "Listing is required"],
      index: true
    },

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer is required"],
      index: true
    },

    offerPrice: {
      type: Number,
      required: [true, "Offer price is required"],
      min: [0.01, "Offer price must be greater than 0"]
    },

    message: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "DECLINED", "WITHDRAWN"],
      default: "PENDING",
      index: true
    }
  },
  { timestamps: true }
)


offerSchema.index({ listingId: 1, createdAt: -1 })

// Prevent duplicate active offers by same buyer on same listing
offerSchema.index(
  { listingId: 1, buyerId: 1 },
  { unique: true }
)

export default mongoose.model("Offer", offerSchema)
