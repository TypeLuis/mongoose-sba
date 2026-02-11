import express from "express"
import requireBody from "../middleware/requireBody.js"
import userController from "../controller/userController.js"

const router = express.Router()

router
  .route("/")

  .post(requireBody(["username", "displayName"]), userController.createUser)

  .get(userController.getUsers)

router
  .route("/:id")

  .get(userController.getUser)

  .patch(userController.updateUser)

  .delete(userController.deleteUser)

export default router
