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
  const user = await UserModel.findOne({ phone });
  if (user) {
    user.authId = authId;
    user.name = name;
    user.gender = gender;
    user.avatar = avatar;
    user.isRegistered = true;
    await user.save();
    return user;
  }
  const newUser = new UserModel({
    authId,
    phone,
    email,
    name,
    gender,
    avatar,
  });
  await newUser.save();
  return newUser;
};

const getUserByAuthIdService = async (payload) => {
  const { authId } = payload;
  if (!authId) {
    throw new Error("authId is required");
  }
  const findUser = await UserModel.findOne({authId});
  if (!findUser) {
    throw new Error("User not found");
  }
  return findUser;
};

module.exports = {
  userRegisterService,
  getUserByAuthIdService,
};
