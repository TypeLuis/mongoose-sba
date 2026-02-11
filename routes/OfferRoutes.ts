import express, { type RequestHandler } from "express";
import mongoose from "mongoose";
import Offer from "../models/offerSchema.js";
import Listing from "../models/listingSchema.js";
import requireBody from "../middleware/requireBody.js";
import msgError from "../utilities/msgError.js";
import { resolve } from "node:dns";

const router = express.Router();
const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);


router
    .route('/')

    .post(
    requireBody(["listingId", "buyerId", "offerPrice"]), 
    async (req,res,next) => {
        try {
            const listingId = String(req.body.listingId ?? "");
            const buyerId = String(req.body.buyerId ?? "");
            const offerPrice = req.body.offerPrice;
        
            if (!isValidId(listingId)) return next(msgError(400, "Invalid listingId"));
            if (!isValidId(buyerId)) return next(msgError(400, "Invalid buyerId"));

            // Ensure listing exists and is ACTIVE
            const listing = await Listing.findById(listingId);
            if (!listing) return next(msgError(404, "Listing not found"));
            if (listing.status !== "ACTIVE") return next(msgError(409, "Listing is not accepting offers"));

            // Prevent seller offering on own listing
            if (String(listing.sellerId) === buyerId) {
                return next(msgError(400, "Seller cannot make an offer on their own listing"));
            }

            const created = await Offer.create({
                listingId,
                buyerId,
                offerPrice,
                message: req.body.message
            })

            res.status(201).json(created)
            
        } catch (error:any) {
            // Duplicate key (ex: unique index listingId+buyerId)
            if (error?.code === 11000) {
                return next(msgError(409, "You already made an offer on this listing"))
            }
  
            next(msgError(400, error?.message ?? "Failed to create offer"))
        }
    })


    .get(async (req,res,next) => {
        try {
            const {listingId, buyerId, status} = req.query

            const filter: Record<string, any> = {}

            if(listingId){
                if(!isValidId(String(listingId))) return next(msgError(400, "Invalid listingId"));
                filter.listingId = listingId
            }

            if(buyerId){
                if(!isValidId(String(buyerId))) return next(msgError(400, "Invalid buyerId"));
                filter.buyerId = buyerId
            }

            if(status) filter.status = status

            const offers = await Offer.find(filter)
            .sort({createdAt : -1})
            .populate("buyerId", "username displayName")
            .populate("listingId", "title price status sellerId")

            res.json(offers)
        } catch (error:any) {
            next(error)
        }
    })


router.route("/:id").get(async (req,res,next) => {
    try {
        const id = String(req.params.id)
        if (!isValidId(id)) return next(msgError(400, "Invalid offer id"));

        const offer = await Offer.findById(id)
        .populate("buyerId", "username displayName")
        .populate("listingId", "title price status sellerId")
  
        if (!offer) return next(msgError(404, "Offer not found"));
        res.json(offer)

    } catch (error) {
        next(error)
    }
})


router.route('/:id/withdraw').patch(async (req,res,next) => {
    try {
        const id = String(req.params.id)
        if (!isValidId(id)) return next(msgError(400, "Invalid offer id"));
    
        const buyerId = String(req.body.buyerId ?? "")
        if (!isValidId(buyerId)) return next(msgError(400, "Invalid buyerId"));

        const offer = await Offer.findById(id)
        if (!offer) return next(msgError(404, "Offer not found"));

        // Only Buyer can withdraw
        if (String(offer.buyerId) !== buyerId) {
            return next(msgError(403, "Not allowed to withdraw this offer"));
        }

        if (offer.status !== "PENDING") {
            return next(msgError(409, "Only PENDING offers can be withdrawn"));
        }

        offer.status = "WITHDRAWN"
        await offer.save()
    
        res.json(offer)
    } catch (error:any) {
        next(msgError(400, error?.message ?? "Failed to withdraw offer"))
    }
})

// Notes on session/transaction in MongoDB!
// What is transaction? “Either ALL these database changes succeed, or NONE of them do.”
// session.startTransaction() -> Start grouping all upcoming operations together.
// await session.commitTransaction() -> Apply all changes permanently.
// await session.abortTransaction() -> Undo everything that happened during this transaction.
// if running locally you need to run this -> mongod --dbpath "/your/data/path" --replSet rs0
router.route("/:id/accept").patch(async (req,res,next) => {
    const id = String(req.params.id)
    if (!isValidId(id)) return next(msgError(400, "Invalid offer id"));

    const sellerId = String(req.body.sellerId ?? "")
    if (!isValidId(sellerId)) return next(msgError(400, "Invalid sellerId"));
    
    const session = await mongoose.startSession()
    session.startTransaction()
    
    try {
        const offer = await Offer.findById(id).session(session)
        if (!offer) {
          await session.abortTransaction()
          return next(msgError(404, "Offer not found"))
        }

        if (offer.status != "PENDING") {
            await session.abortTransaction()
            return next(msgError(409, "Only PENDING offers can be accepted"))
        }

        const listing = await Listing.findById(offer.listingId).session(session)
        if (!listing) {
            await session.abortTransaction()
            return next(msgError(404, "Listing not found"))
        }

        // verify seller owns listing
        if (String(listing.sellerId) !== sellerId) {
            await session.abortTransaction()
            return next(msgError(403, "Not allowed to accept offers for this listing"))
        }

        if (listing.status !== "ACTIVE") {
            await session.abortTransaction()
            return next(msgError(409, "Listing is not ACTIVE"))
        }

        offer.status = "ACCEPTED"
        await offer.save({ session })

        // Decline all other pending offers for this listing
        await Offer.updateMany(
            {
            listingId: offer.listingId,
            _id: { $ne: offer._id },
            status: "PENDING"
            },
            { $set: { status: "DECLINED" } },
            { session }
        )

        listing.status = "SOLD"
        await listing.save({ session })

        await session.commitTransaction()
        session.endSession()

        const populated = await Offer.findById(offer._id)
        .populate("buyerId", "username displayName")
        .populate("listingId", "title price status sellerId");

        res.json(populated)
    } catch (error:any) {
        await session.abortTransaction()
        session.endSession()
        next(msgError(400, error?.message ?? "Failed to accept offer"))
    }
})

router.route('/:id/decline').patch(async (req,res,next) => {
    const id = String(req.params.id)
    if (!isValidId(id)) return next(msgError(400, "Invalid offer id"));

    const sellerId = String(req.body.sellerId ?? "")
    if (!isValidId(sellerId)) return next(msgError(400, "Invalid sellerId"));

    try {
        const offer = await Offer.findById(id)
        if (!offer) return next(msgError(404, "Offer not found"));
        if (offer.status !== "PENDING") return next(msgError(409, "Only PENDING offers can be declined"));

        const listing = await Listing.findById(offer.listingId)
        if (!listing) return next(msgError(404, "Listing not found"));
    
        if (String(listing.sellerId) !== sellerId) {
          return next(msgError(403, "Not allowed to decline offers for this listing"));
        }

        offer.status = "DECLINED"
        await offer.save()

        res.json(offer)
    } catch (error:any) {
        next(msgError(400, error?.message ?? "Failed to decline offer"))
    }
})

export default router