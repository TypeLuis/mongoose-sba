import mongoose from "mongoose";
import dotenv from "dotenv"
import testSchema from "../models/testSchema.js";
import {testSeed} from "./data.js";

dotenv.config()

const connectionStr = process.env.MONGODB_URI || ""

async function seedDatabase(){
    try {
        await mongoose.connect(connectionStr)

        await testSchema.deleteMany({})

        await testSchema.create(testSeed)

        console.log("Data seeded")

        process.exit(1)

    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}


seedDatabase()