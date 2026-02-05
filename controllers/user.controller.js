const {
  userRegisterService,
  getUserByAuthIdService,
} = require("../services/user.service");
const { handleError } = require("../utils/error.handler");

const userRegister = async (req, res) => {
  try {
    const authId = req.user.id;
    const phone = req.user.phone;
    const payload = req.body;
    payload.authId = authId;
    payload.phone = phone;
    const data = await userRegisterService(payload);
    return res.status(200).json({
      responseCode: 200,
      message: `user ${data.isUpdated ? " updated " : " created "} successfully`,
      data: data.user,
    });
  } catch (error) {
    return handleError(res, error, "userRegister");
  }
};

const getUserByAuthId = async (req, res) => {
  try {
    const payload = req.body;
    const data = await getUserByAuthIdService(payload);
    return res.status(200).json({
      responseCode: 200,
      message: "user Profile fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error, "getUserByUserId");
  }
};

const getMyProfile = async (req, res) => {
  try {
    const authId = req.user.id;
    let payload = authId;
    const data = await getUserByAuthIdService(payload);
    return res.status(200).json({
      responseCode: 200,
      message: "Profile fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error, "getMyProfile");
  }
};

module.exports = {
  userRegister,
  getUserByAuthId,
  getMyProfile,
};
