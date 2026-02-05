const UserModel = require("../model/user.schema");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { userRegisterValidator } = require("../validators/user.validator");
const { producer } = require("../kafka/producer");
const Topics = require("../kafka/topics")

const userRegisterService = async (payload) => {
  const { authId, name, email, phone, gender, avatar } = payload;
  const { error } = userRegisterValidator.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  let user;
  let isUpdated = false;
  user = await UserModel.findOne({ phone });
  if (user) {
    user.authId = authId;
    user.name = name;
    user.gender = gender;
    user.avatar = avatar;
    user.isRegistered = true;
    user.version = (user.version || 0) + 1;
    await user.save();
    isUpdated = true;
  } else {
    user = new UserModel({
      authId,
      phone,
      email,
      name,
      gender,
      avatar,
      version: 0,
    });
    await user.save();
  }

  await producer.send({
    topic: Topics.AUTHUSER_REGISTERED,
    messages: [
      {
        value: JSON.stringify({
          authId,
          userId: user._id,
          isRegistered: true,
        }),
      },
    ],
  });

  // await sendEvent({
  //   topic: USER_EVENTS,
  //   message: {
  //     eventType,
  //     authId: user.authId,
  //     version: user.version,
  //     payload: {
  //       name: user.name,
  //       email: user.email,
  //       phone: user.phone,
  //       gender: user.gender,
  //       avatar: user.avatar,
  //       isRegistered: user.isRegistered,
  //       status: user.status || "active",
  //     },
  //   },
  // });

  const data = {
    user,
    isUpdated,
  };

  return data;
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
