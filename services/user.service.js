const UserModel = require("../model/user.schema");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { userRegisterValidator } = require("../validators/user.validator");

const userRegisterService = async (payload) => {
  const { authId, name, email, phone, gender, avatar } = payload;
  const { error } = userRegisterValidator.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  let eventType;
  const user = await UserModel.findOne({ phone });
  if (user) {
    user.authId = authId;
    user.name = name;
    user.gender = gender;
    user.avatar = avatar;
    user.isRegistered = true;
    user.version = (user.version || 0) + 1;
    await user.save();
    eventType = "USER_UPDATED"
    return user;
  }
  const newUser = new UserModel({
    authId,
    phone,
    email,
    name,
    gender,
    avatar,
    version: 0
  });
  eventType = "USER_CREATED"
  await newUser.save();
  return newUser;
};

const getUserByAuthIdService = async (payload) => {
  const { authId } = payload;
  console.log("payloadd is: ", payload);
  console.log("authId is ", authId);
  if (!authId) {
    throw new Error("authId is required");
  }
  const findUser = await UserModel.findOne({ authId });
  if (!findUser) {
    throw new Error("User not found");
  }
  return findUser;
};

module.exports = {
  userRegisterService,
  getUserByAuthIdService,
};
