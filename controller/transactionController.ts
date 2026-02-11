import { type RequestHandler } from "express";
import mongoose from "mongoose";
import Transaction from "../models/transactionSchema.js";
import Offer from "../models/offerSchema.js";
import Listing from "../models/listingSchema.js";
import msgError from "../utilities/msgError.js";

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const transactionController = {

    // Create Transaction
    createTransaction : (async (req,res,next) => {
            const offerId = String(req.body.offerId ?? "")
            const sellerId = String(req.body.sellerId ?? "")
          
            if (!isValidId(offerId)) return next(msgError(400, "Invalid offerId"));
            if (!isValidId(sellerId)) return next(msgError(400, "Invalid sellerId"));
    
            const session = await mongoose.startSession()
            session.startTransaction()
            const abortSession = async (code:number, msg:string) => {
                await session.abortTransaction()
                session.endSession()
                return next(msgError(code, msg))
            }
    
            try {
                const offer = await Offer.findById(offerId).session(session)
                if (!offer) return await abortSession(404, "Offer not found");
            
                if (offer.status !== "ACCEPTED") {
                    return await abortSession(409, "Only ACCEPTED offers can be finalized")
                }
            
                const listing = await Listing.findById(offer.listingId).session(session)
                if (!listing) return await abortSession(404, "Listing not found");
    
                // Verify seller owns listing
                if (String(listing.sellerId) !== sellerId) {
                    return await abortSession(403, "Not allowed to finalize this transaction")
                }
    
                if (listing.status !== "SOLD") {
                    listing.status = "SOLD";
                    await listing.save({ session });
                }
              
                const created = new Transaction({
                    listingId: listing._id,
                    offerId: offer._id,
                    sellerId: listing.sellerId,
                    buyerId: offer.buyerId,
                    salePrice: offer.offerPrice,
                    status: "COMPLETED"
                  });
                  
                await created.save({ session });
            
                await session.commitTransaction();
                session.endSession();
                  
                // Another way to populate the object.
                await created.populate([
                    { path: "buyerId", select: "username displayName" },
                    { path: "sellerId", select: "username displayName" },
                    { path: "listingId", select: "title price status" },
                    { path: "offerId", select: "offerPrice status" },
                ])
          
                res.status(201).json(created)
      
            } catch (error:any) {
                
    
                // unique indexes like offerId or listingId, duplicates throw 11000
                if (error?.code === 11000) {
                    return await abortSession(409, "Transaction already exists for this listing/offer")
                }
              
                return await abortSession(400, error?.message ?? "Failed to create transaction");
            }
    }) as RequestHandler,

    // Get all Transactions
    getTransactions : ( async (req,res,next) => {
            const { buyerId, sellerId, listingId, status } = req.query;
    
            const filter: Record<string, any> = {}
    
            if (buyerId) {
                if (!isValidId(String(buyerId))) return next(msgError(400, "Invalid buyerId"));
                filter.buyerId = buyerId
            }
          
              if (sellerId) {
                if (!isValidId(String(sellerId))) return next(msgError(400, "Invalid sellerId"));
                filter.sellerId = sellerId
            }
          
              if (listingId) {
                if (!isValidId(String(listingId))) return next(msgError(400, "Invalid listingId"));
                filter.listingId = listingId
            }
    
            
            if (status) filter.status = status
    
            const txs = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .populate("buyerId", "username displayName")
            .populate("sellerId", "username displayName")
            .populate("listingId", "title price status")
            .populate("offerId", "offerPrice status")
    
            res.json(txs)
    }) as RequestHandler,

    // Get Transaction by ID
    getTransaction : (async (req,res,next) => {
        const id = String(req.params.id)
        if (!isValidId(id)) return next(msgError(400, "Invalid transaction id"));
      
        try {
          const transaction = await Transaction.findById(id)
            .populate("buyerId", "username displayName")
            .populate("sellerId", "username displayName")
            .populate("listingId", "title price status")
            .populate("offerId", "offerPrice status")
      
          if (!transaction) return next(msgError(404, "Transaction not found"));
          res.json(transaction)
        } catch (err) {
          next(err);
        }
    }) as RequestHandler
}

export default transactionController