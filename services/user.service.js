const UserModel = require("../model/user.schema");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { userRegisterValidator } = require("../validators/user.validator");

const userRegisterService = async (payload) => {
  const { userId, name, email, phone, gender, avatar } = payload;
  const { error } = userRegisterValidator.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const user = await UserModel.findOne({ phone });
  if (user) {
    user.name = name;
    user.gender = gender;
    user.avatar = avatar;
    user.isRegistered = true;
    await user.save();
    return user;
  }
  const newUser = new UserModel({
    phone,
    email,
    name,
    gender,
    avatar,
  });
  await newUser.save();
  return newUser;
};

module.exports = {
  userRegisterService,
};
