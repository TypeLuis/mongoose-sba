import express from "express";
import requireBody from "../middleware/requireBody.js";
import offerController from "../controller/offerController.js";

const router = express.Router();

router
    .route('/')

    .post(
        requireBody(["listingId", "buyerId", "offerPrice"]), 
        offerController.createOffer
    )


    .get(offerController.getOffers);

router.route("/:id").get(offerController.GetOffer)

router.route('/:id/withdraw').patch(offerController.status.withdraw)

// Notes on session/transaction in MongoDB!
// What is transaction? “Either ALL these database changes succeed, or NONE of them do.”
// session.startTransaction() -> Start grouping all upcoming operations together.
// await session.commitTransaction() -> Apply all changes permanently.
// await session.abortTransaction() -> Undo everything that happened during this transaction.
// if running locally you need to run this -> mongod --dbpath "/your/data/path" --replSet rs0
router.route("/:id/accept").patch(offerController.status.accept)

router.route('/:id/decline').patch(offerController.status.decline)

export default router