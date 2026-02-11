import express from "express";
import requireBody from "../middleware/requireBody.js";
import transactionController from "../controller/transactionController.js";

const router = express.Router();

router
    .route('/')

    .post(requireBody(["offerId", "sellerId"]), transactionController.createTransaction)

    .get(transactionController.getTransactions)

router.route('/:id').get(transactionController.getTransaction)

export default router