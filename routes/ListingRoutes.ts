import express, { type RequestHandler } from "express";
import mongoose from "mongoose";
import Listing from "../models/listingSchema.js";
import requireBody from "../middleware/requireBody.js";
import msgError from "../utilities/msgError.js";


const router = express.Router();

const isValidId = (id:string) => mongoose.Types.ObjectId.isValid(id);

const toNumber = (v: unknown): number | null => {
    if (typeof v !== "string" && typeof v !== "number") return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
};


router
  .route("/")
  // CREATE
  .post(
    requireBody(["sellerId", "title", "category", "condition", "price"]),
    (async (req, res, next) => {
      try {
        if (!isValidId(String(req.body.sellerId))) return next(msgError(400, "Invalid sellerId"));

        const created = await Listing.create(req.body)
        res.status(201).json(created)
      } catch (err:any) {
        const error = err
        next(msgError(400, error.message))
      }
    }) as RequestHandler
  )

  // READ ALL (with filters)
  .get((async (req, res, next) => {
    try {
      const { category, status, sellerId, q } = req.query

      const minPrice = toNumber(req.query.minPrice)
      const maxPrice = toNumber(req.query.maxPrice)

      const filter: Record<string, any> = {}

      if (category) filter.category = String(category);
      if (status) filter.status = String(status);

      if (sellerId) {
        if (!isValidId(String(sellerId))) return next(msgError(400, "Invalid sellerId"));
        filter.sellerId = String(sellerId)
      }

      if (minPrice !== null || maxPrice !== null) {
        filter.price = {}
        if (minPrice !== null) filter.price.$gte = minPrice
        if (maxPrice !== null) filter.price.$lte = maxPrice
      }

    // regex to find query in title, $options: "i" to make case insensitive
      if (q) filter.title = { $regex: String(q), $options: "i" };

      // populates the sellerId with the username and displayName
      const listings = await Listing.find(filter)
        .sort({ createdAt: -1 })
        .populate("sellerId", "username displayName");

      res.json(listings)
    } catch (err) {
      next(err)
    }
  }) as RequestHandler);

router
  .route("/:id")
  // READ ONE
  .get((async (req, res, next) => {
    const id = String(req.params.id)
    if (!isValidId(id)) return next(msgError(400, "Invalid listing id"));

    try {
      const listing = await Listing.findById(id).populate(
        "sellerId",
        "username displayName"
      )

      if (!listing) return next(msgError(404, "Listing not found"));
      res.json(listing)
    } catch (err) {
      next(err)
    }
  }) as RequestHandler)

  // PATCH
  .patch((async (req, res, next) => {
    const id = String(req.params.id)
    if (!isValidId(id)) return next(msgError(400, "Invalid listing id"));

    if (req.body.sellerId) return next(msgError(400, "sellerId cannot be changed"));

    try {
      const updated = await Listing.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      }).populate("sellerId", "username displayName")

      if (!updated) return next(msgError(404, "Listing not found"));
      res.json(updated)
    } catch (err:any) {
      next(msgError(400, err.message))
    }
  }) as RequestHandler)

  // DELETE
  .delete((async (req, res, next) => {
    const id = String(req.params.id)
    if (!isValidId(id)) return next(msgError(400, "Invalid listing id"));

    try {
      const deleted = await Listing.findByIdAndDelete(id)
      if (!deleted) return next(msgError(404, "Listing not found"));
      res.json(deleted)
    } catch (err) {
      next(err)
    }
  }) as RequestHandler)

export default router;
