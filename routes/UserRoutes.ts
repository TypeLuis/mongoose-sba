import express from "express";
import User from "../models/userSchema.js";
import requireBody from "../middleware/requireBody.js";


const router = express.Router()

router
    .route('/')

    .post(requireBody(["username", "displayName"]), async (req,res,next) => {
        let newUser = await User.create(req.body)
    
        res.json(newUser)
    })

    .get(async (req,res,next) => {
        let allUser = await User.find({})
    
        res.json(allUser)
    })


router
    .route('/:id')

    .put(async (req,res,_next) => {
        let updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true}) //new true allows you to see updated json
    
        res.json(updateUser)
    })

    .delete(async (req,res) => {
        let deletedUser = await User.findByIdAndDelete(req.params.id) 
    
        res.json(deletedUser)
    })


export default router