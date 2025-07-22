const {Router} = require("express")
const userRouter = Router()
const userController = require("../controllers/user.controller")

userRouter.get("/", userController.usersListGet)
userRouter.get("/create", userController.usersCreateGet)
userRouter.post("/create", userController.usersCreatePost)
userRouter.get("/update/:id", userController.usersUpdateGet)
userRouter.post("/update/:id", userController.usersUpdatePost)
userRouter.post("/delete/:id", userController.usersDeletePost)
userRouter.get("/search", userController.usersSearchGet)
userRouter.get("/searchbyEmail", userController.usersSearchEmailGet)

module.exports = userRouter