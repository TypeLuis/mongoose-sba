import express, { type RequestHandler } from "express";
import mongoose from "mongoose";
import Listing from "../models/listingSchema.js";
import requireBody from "../middleware/requireBody.js";
import msgError from "../utilities/msgError.js";

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id)

