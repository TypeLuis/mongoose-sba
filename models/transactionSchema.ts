import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: [true, "Listing is required"],
      index: true
    },

    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: [true, "Offer is required"],
      unique: true,
      index: true
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller is required"],
      index: true
    },

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer is required"],
      index: true
    },

    salePrice: {
      type: Number,
      required: [true, "Sale price is required"],
      min: [0.01, "Sale price must be greater than 0"]
    },

    status: {
      type: String,
      enum: ["COMPLETED", "CANCELLED", "REFUNDED"],
      default: "COMPLETED"
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)


// Prevent more than one sale for the same listing
transactionSchema.index(
  { listingId: 1 },
  { unique: true }
)

export default mongoose.model("Transaction", transactionSchema)
