import express from "express";
import Produce from "../models/testSchema.js"
import testController from "../controller/testController.js";

const router = express.Router()

router
    .route('/')
    
    .post(testController.createTest)
    .get(testController.getTests)


router
    .route('/:id')
    .put(testController.updateTest)
    .delete(testController.deleteTest)
    .get(testController.getTest)


router.route('/:id/category').put(async (req,res) => {
    let currentProduce = await Produce.findById(req.params.id)

    let otherProduce = await (currentProduce as any).getCategory()


    res.json(otherProduce)
})

export default router