const express = require("express");
const UserRouter = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const { userRegister, getUserByAuthId, getMyProfile } = require("../controllers/user.controller");

UserRouter.post("/userRegister", authMiddleware, userRegister);
UserRouter.post("/getUserByAuthId", authMiddleware, getUserByAuthId);
UserRouter.get("/getMyProfile", authMiddleware, getMyProfile);

module.exports = UserRouter;
