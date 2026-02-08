import msgError from "../utilities/msgError.js";
import type { RequestHandler } from "express";
import Test from "../models/testSchema.js"

const testController = {
    // Route to get multiple Test
    getTests : (async (req,res) => {
        let allTest = await Test.find({})
    
        res.json(allTest)
    }) as RequestHandler,

    // Route to create a Test
    createTest : (async (req,res) => {
        let newTest = await Test.create(req.body)
    
        res.json(newTest)
    }) as RequestHandler,

    // Route to get a singular Test
    getTest : (async (req,res) => {
        let oneTest = await Test.findById(req.params.id) 
    
        res.json(oneTest)
    }) as RequestHandler,

    // Route to update a Test
    updateTest : (async (req,res) => {
        let updateTest = await Test.findByIdAndUpdate(req.params.id, req.body, {new: true}) //new true allows you to see updated json
    
        res.json(updateTest)
    }) as RequestHandler,


    // Route to Delete Test, Test's posts & Test's like/ likes on Test's post
    deleteTest : (async (req,res) => {
        let deletedTest = await Test.findByIdAndDelete(req.params.id) 
    
        res.json(deletedTest)
    }) as RequestHandler
}

export default testController