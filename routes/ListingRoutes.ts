import express from "express";
import requireBody from "../middleware/requireBody.js";
import listingController from "../controller/listingController.js";

const router = express.Router();

router
  .route("/")
  // CREATE
  .post(
    requireBody(["sellerId", "title", "category", "condition", "price"]),
    listingController.createListing
  )

  // READ ALL (with filters)
  .get(listingController.getListings);

router
  .route("/:id")
  // READ ONE
  .get(listingController.getListing)

  // PATCH
  .patch(listingController.updateListing)

  // DELETE
  .delete(listingController.deleteListing)

export default router;
