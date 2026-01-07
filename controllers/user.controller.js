const { userRegisterService } = require("../services/user.service");
const { handleError } = require("../utils/error.handler");

const userRegister = async (req, res) => {
  try {
    const userId = req.user.id;
    const phone = req.user.phone;
    const payload = req.body;
    payload.userId = userId;
    payload.phone = phone;
    const data = await userRegisterService(payload);
    return res.status(200).json({
      responseCode: 200,
      message: "User registered successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error, "userRegister");
  }
};

module.exports = {
  userRegister,
};
