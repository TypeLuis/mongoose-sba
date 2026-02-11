import msgError from "../utilities/msgError.js";
import type { RequestHandler } from "express";
import requireBody from "../middleware/requireBody.js";
import User from "../models/userSchema.js";
import mongoose from "mongoose";

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id)

const userController = {
    createUser : (async (req, res, next) => {
        try {
          const newUser = await User.create(req.body)
          res.status(201).json(newUser)
        } catch (err:any) {
    
          if (err.code === 11000) return next(msgError(409, "Username already exists")) // 11000 = Duplicate key error, MongoDB error code from unique being true
          next(msgError(400, err.message))
        }
    }) as RequestHandler,

    getUsers :  (async (_req, res, next) => {
        try {
          const allUsers = await User.find({}).sort({ createdAt: -1 }) // finds all the users created at in decending order
          res.json(allUsers)
        } catch (err) {
          next(err)
        }
    }) as RequestHandler,

    getUser : (async (req, res, next) => {
        const id = String(req.params.id)
        if (!isValidId(id)) {
          return next(msgError(400, "Invalid user id"))
        }
    
        try {
          const user = await User.findById(req.params.id)
          if (!user) {
            return next(msgError(404, "User not found"))
          }
          res.json(user)
        } catch (err) {
          next(err)
        }
    }) as RequestHandler,

    updateUser : (async (req, res, next) => {
        const id = String(req.params.id)
        if (!isValidId(id)) {
          return next(msgError(400, "Invalid user id"))
        }
    
        try {
          const updated = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
          )
    
          if (!updated) {
            return next(msgError(404, "User not found"))
          }
    
          res.json(updated)
        } catch (err:any) {
          if (err.code === 11000) {
            return next(msgError(409, "Username already exists"))
          }
          next(msgError(400, err.message))
        }
    }) as RequestHandler,

    deleteUser : (async (req, res, next) => {
        const id = String(req.params.id)
        if (!isValidId(id)) {
          return next(msgError(400, "Invalid user id"))
        }
    
        try {
          const deleted = await User.findByIdAndDelete(req.params.id)
          if (!deleted) {
            return next(msgError(404, "User not found"))
          }
          res.json(deleted)
        } catch (err) {
          next(err)
        }
    }) as RequestHandler
}


export default userController