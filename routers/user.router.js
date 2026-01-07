const express = require("express");
const UserRouter = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const { userRegister } = require("../controllers/user.controller");

UserRouter.post("/userRegister", authMiddleware, userRegister);


module.exports = UserRouter;
