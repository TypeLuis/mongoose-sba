import mongoose, { type Model } from "mongoose";
import dotenv from "dotenv"
import User from "../models/userSchema.js";
import Listing from "../models/listingSchema.js";
import Offer from "../models/offerSchema.js";
import Transaction from "../models/transactionSchema.js";
import {offers,users,transactions,listings} from "./data.js";

dotenv.config()

const connectionStr = process.env.MONGODB_URI || ""

const seedData = async <T> (model: Model<T>, data:any[]): Promise<void> => {
    await model.deleteMany({})
    await model.insertMany(data)
}

async function seedDatabase(){
    try {
        await mongoose.connect(connectionStr)

        seedData(User, users)
        seedData(Listing, listings)
        seedData(Offer, offers)
        seedData(Transaction, transactions)

        console.log("Data seeded successfully")

        process.exit(0) // script finished successfully

    } catch (error) {
        console.error(error)
        process.exit(1) // script exited with error
    }
}


seedDatabase()